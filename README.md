# Backend Time

A robust RESTful API built with Node.js, Express, and TypeScript for managing users and projects. This backend application utilizes Prisma ORM with a PostgreSQL database and includes secure authentication using JWT.

## Features

- **User Authentication**: Secure user registration and login with bcrypt password hashing and JWT token generation.
- **User Management**: Retrieve user profiles.
- **Project Management**: Complete CRUD (Create, Read, Update, Delete) operations for projects.
- **Secure**: Protected routes using middleware to verify JWT tokens.
- **Type-Safe**: Built with TypeScript for enhanced code quality and maintainability.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Authentication**: JSON Web Tokens (JWT) & bcrypt
- **Deployment**: Vercel ready

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm
- PostgreSQL database

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd backend_time
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/mydb?schema=public"
   JWT_SECRET="your_secret_key"
   PORT=3000
   ```
   *Replace the placeholders with your actual database credentials and secret key.*

4. Generate Prisma client:
   ```bash
   npx prisma generate
   ```

5. Run database migrations:
   ```bash
   npx prisma migrate dev --name init
   ```

### Running the Application

- **Development Mode**:
  ```bash
  npm run dev
  ```
  The server will start at `http://localhost:3000` (or your defined PORT).

## API Endpoints

### Authentication

- **POST** `/register`: Register a new user.
  - Body: `{ "name": "String", "email": "String", "password": "String" }`
- **POST** `/login`: Login and receive a JWT.
  - Body: `{ "email": "String", "password": "String" }`

### Users

- **GET** `/users`: Get all users.
- **GET** `/users/:id`: Get a specific user by ID.

### Projects

- **POST** `/projects`: Create a new project.
  - Body:
    ```json
    {
      "groupName": "String",
      "projectName": "String",
      "description": "String",
      "startDate": "YYYY-MM-DD",
      "endDate": "YYYY-MM-DD",
      "status": "String",
      "ownerId": "UserUUID"
    }
    ```
- **GET** `/projects/:userId`: Get all projects belonging to a specific user.
- **GET** `/projectsById/:id`: Get a specific project by its ID.
- **PUT** `/projects/:id/:userId`: Update a project.
- **DELETE** `/projects/:id/:userId`: Delete a project.

## Project Structure

```
├── prisma/             # Prisma schema and migrations
├── index.ts            # Entry point and API routes
├── package.json        # Dependencies and scripts
├── tsconfig.json       # TypeScript configuration
└── vercel.json         # Vercel deployment configuration
```

## License

ISC
