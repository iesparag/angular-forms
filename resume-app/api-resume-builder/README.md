# Resume Builder API

A scalable Node.js backend API for a resume builder application with MongoDB integration.

## Features

- User Authentication (Register, Login, Forgot Password)
- Multiple Resume Management per User
- Secure JWT Authentication
- MongoDB Integration
- MVC Architecture
- RESTful API Design

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for Authentication
- bcryptjs for Password Hashing
- Express Validator for Input Validation
- CORS enabled

## Project Structure

```
src/
├── config/
│   └── database.js
├── controllers/
│   ├── userController.js
│   └── resumeController.js
├── middleware/
│   └── auth.js
├── models/
│   ├── User.js
│   └── Resume.js
├── routes/
│   ├── userRoutes.js
│   └── resumeRoutes.js
└── index.js
```

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a .env file in the root directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/resume-builder
   JWT_SECRET=your_jwt_secret_key_here
   NODE_ENV=development
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### User Routes
- POST /api/users/register - Register a new user
- POST /api/users/login - User login
- POST /api/users/forgot-password - Request password reset

### Resume Routes (Protected)
- POST /api/resumes - Create a new resume
- GET /api/resumes - Get all resumes for authenticated user
- GET /api/resumes/:id - Get specific resume by ID
- PUT /api/resumes/:id - Update a resume
- DELETE /api/resumes/:id - Delete a resume

## Authentication

All resume routes are protected and require a valid JWT token in the Authorization header:
```
Authorization: Bearer <your_token_here>
```

## Future Enhancements

- AWS S3 Integration for file uploads
- Email utilities for password reset and notifications
- Enhanced security features
- Rate limiting
- File compression and optimization
