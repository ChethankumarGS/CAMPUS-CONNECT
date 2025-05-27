# Learning Management System API

A RESTful API for a Learning Management System built with Node.js, Express, and MongoDB.

## Features

- User Authentication & Authorization
- Role-based Access Control (Student, Lecturer, Admin)
- Course Management
- Learning Materials Management
- File Upload Support
- JWT-based Authentication

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository:
   git clone `repository-url`
   cd backend

2. Install dependencies:
   npm install

3. Create a `.env` file in the root directory:
   PORT=4000
   MONGODB_URI=mongodb://localhost:27017/lms
   JWT_SECRET=your_jwt_secret_key

4. Create an uploads directory:
   mkdir uploads

## Project Structure

backend/
├── src/
│ ├── @types/ # Type definitions
│ ├── controllers/ # Request handlers
│ ├── middlewares/ # Custom middleware
│ ├── models/ # MongoDB models
│ ├── routes/ # Route definitions
│ ├── utils/ # Utility functions
│ └── app.ts # App entry point
├── uploads/ # Uploaded files
├── package.json
├── tsconfig.json
└── README.md

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/verifyToken` - Verifies a user auth token

### Users

- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get user by ID

### Courses

- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course by ID
- `PUT /api/courses/:id` - Update course (Admin/Lecturer)
- `GET /api/courses/students` - Get all courses taken by the student
- `GET /api/courses/:courseId/students` - Get all students enrolled in a specific course

- `POST /api/courses` - Create a new course (Admin/Lecturer)
- `POST /api/courses/:courseId/enroll` - Enroll the authenticated student in a course

- `DELETE /api/courses/:id` - Delete course (Admin/Lecturer)
- `DELETE /api/courses/:id` - Delete course (Admin/Lecturer)
- `DELETE /api/courses/:courseId/disenroll` - Disenroll the authenticated student from a course

### Materials

- `POST /api/materials/:courseId` - Upload course material (Lecturer)
- `GET /api/materials/:courseId` - Get course materials
- `DELETE /api/materials/:id` - Delete material (Lecturer/Admin)

Authentication:

The API uses JWT for authentication. Include the token in the Authorization header:

Authorization: Bearer <your_token>

## Role-Based Access

Three user roles are supported:

- `student` - Can view courses and materials
- `lecturer` - Can create/manage courses and materials
- `admin` - Has full system access

## File Upload

Supported file types:

- PDF (.pdf)
- Microsoft Word (.doc, .docx)
- PowerPoint (.ppt, .pptx)

Maximum file size: 10MB

## Error Handling

The API returns appropriate HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

## Development

Start the development server:
npm run dev

Build for production:
npm run build

Start production server:
npm start

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request.
