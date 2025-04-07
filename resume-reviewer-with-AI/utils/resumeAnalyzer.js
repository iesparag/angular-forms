const openai = require('../config/openai');

class ResumeAnalyzer {
    static async analyzeResume(resumeText) {
        try {
            const response = await openai.chat.completions.create({
                model: "gpt-4",
                messages: [
                    {
                        role: "system",
                        content: "You are a professional resume reviewer. Analyze the resume and provide detailed feedback on: 1. Content & Impact 2. Format & Structure 3. Skills Highlight 4. Improvement Areas"
                    },
                    {
                        role: "user",
                        content: `Please analyze this resume:\n\n${resumeText}`
                    }
                ],
                temperature: 0.7,
            });

            return response.choices[0].message.content;
        } catch (error) {
            throw new Error('Failed to analyze resume: ' + error.message);
        }
    }

    static async matchJobDescription(resumeText, jobDescription) {
        try {
            // First, get embeddings for both resume and job description
            const resumeEmbedding = await openai.embeddings.create({
                model: "text-embedding-ada-002",
                input: resumeText,
            });

            const jobEmbedding = await openai.embeddings.create({
                model: "text-embedding-ada-002",
                input: jobDescription,
            });

            // Calculate similarity score (cosine similarity)
            const similarity = this.cosineSimilarity(
                resumeEmbedding.data[0].embedding,
                jobEmbedding.data[0].embedding
            );

            // Get tailored suggestions
            const analysis = await openai.chat.completions.create({
                model: "gpt-4",
                messages: [
                    {
                        role: "system",
                        content: "You are a professional resume consultant. Analyze the resume against the job description and provide specific suggestions for improvement."
                    },
                    {
                        role: "user",
                        content: `Resume:\n${resumeText}\n\nJob Description:\n${jobDescription}\n\nProvide specific suggestions to tailor this resume for the job.`
                    }
                ],
                temperature: 0.7,
            });

            return {
                matchScore: similarity * 100,
                suggestions: analysis.choices[0].message.content
            };
        } catch (error) {
            throw new Error('Failed to match job description: ' + error.message);
        }
    }

    static cosineSimilarity(vecA, vecB) {
        const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
        const normA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
        const normB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
        return dotProduct / (normA * normB);
    }
}

module.exports = ResumeAnalyzer;
