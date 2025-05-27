# Campus connect: Learning Management System Frontend

A modern, responsive frontend for the Learning Management System built with Next.js 14, React, and TypeScript.

## Features

- Modern UI with Tailwind CSS
- Role-based Access Control
- Responsive Design
- File Upload Interface
- Protected Routes
- Authentication State Management
- Course Management Interface
- Learning Materials Management

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Backend API running

## Installation

1. Clone the repository:
   git clone `repository-url`

2. cd frontend

3. Install dependencies:
   npm install

4. Create a `.env.local` file:
   NEXT_PUBLIC_API_URL=<http://localhost:4000/api>
   NEXT_PUBLIC_UPLOAD_URL=<http://localhost:4000/uploads>

## Project Structure

frontend/
├── src/
│ ├── app/ # App router pages
│ ├── components/ # Reusable components
│ ├── context/ # React context providers
│ ├── types/ # TypeScript definitions
│ └── styles/ # Global styles
├── public/ # Static assets
├── package.json
└── README.md

## Key Components

### Authentication

- Login Form
- Registration Form
- Protected Route Wrapper
- Auth Context Provider

### Dashboard

- Student Dashboard
- Lecturer Dashboard
- Admin Dashboard (WIP)
- Course Management
- Material Management

### Course Components

- Course List
- Course Details
- Course Creation Form
- Course Edit Form

### Material Components

- Material Upload Form

## Available Scripts

Start the development server:
npm run dev

Build for production:
npm run build

Start production server:
npm start

## Routes Structure

### Public Routes

- `/` - Home page
- `/login` - Login page
- `/register` - Registration page

### Protected Routes

- `/dashboard` - User dashboard
- `/dashboard/courses` - Course listing
- `/dashboard/courses/[id]` - Course details
- `/dashboard/courses/create` - Create course (Admin/Lecturer)
- `/dashboard/courses/[id]/edit` - Edit course (Admin/Lecturer)
- `/dashboard/courses/[id]/materials` - Course materials
- `/dashboard/courses/[id]/materials/upload` - Upload materials (Lecturer)

## State Management

The application uses React Context for state management:

- `AuthContext` - User authentication state

## API Integration

Authentication:

`const login = async (email: string, password: string) => {
  const response = await fetch(${API_URL}/auth/login, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password }),
  });
  return response.json();
  };`

File Upload:

`const uploadMaterial = async (courseId: string, formData: FormData) => {
  const response = await fetch(${API_URL}/materials/${courseId}, {
  method: 'POST',
  headers: { Authorization: Bearer ${token} },
  body: formData,
  });
  return response.json();
  };`

## Error Handling

The application implements comprehensive error handling:

- Form validation errors
- API request errors
- Authentication errors
- File upload errors
- Network errors

## Styling

- Tailwind CSS for utility-first styling
- Custom components with consistent design
- Responsive design patterns

## Security Features

- JWT token management
- Protected routes
- Role-based access control
- Form validation

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Performance Optimization

- Image optimization using Next Images
- Code splitting using React
- Bundle size optimization using React Inbuilt Modules
- Server-side rendering using NextJS.
