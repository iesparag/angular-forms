# Smart Resume Reviewer

An AI-powered resume reviewer that helps improve your resume and matches it with job descriptions.

## Features

- Resume upload and analysis
- AI-powered feedback using ChatGPT
- Job matching using embeddings
- Resume customization based on job descriptions

## Setup Instructions

### Prerequisites

1. Node.js and npm
2. Angular CLI
3. OpenAI API key

### Backend Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
- Rename `.env.example` to `.env`
- Add your OpenAI API key to `.env`

3. Start the server:
```bash
npm run dev
```

### Frontend Setup

1. Install Angular CLI globally:
```bash
npm install -g @angular/cli
```

2. Create new Angular project:
```bash
ng new frontend --routing --style=scss
cd frontend
```

3. Install required dependencies:
```bash
npm install @angular/material @angular/flex-layout
```

4. Start the Angular development server:
```bash
ng serve
```

## Project Structure

```
resume-reviewer-with-ai/
├── frontend/          # Angular frontend
├── uploads/           # Resume upload directory
├── server.js         # Node.js backend
├── package.json      # Backend dependencies
└── .env             # Environment variables
```

## API Endpoints

- POST `/api/analyze-resume` - Upload and analyze resume
- POST `/api/match-job` - Match resume with job description
