const pdf = require('pdf-parse');
const fs = require('fs');

class PdfParser {
    static async extractText(filePath) {
        try {
            const dataBuffer = fs.readFileSync(filePath);
            const data = await pdf(dataBuffer);
            return data.text;
        } catch (error) {
            throw new Error('Failed to parse PDF: ' + error.message);
        }
    }
}

module.exports = PdfParser;
