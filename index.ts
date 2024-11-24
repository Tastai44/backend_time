import express, { NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(bodyParser.json());
dotenv.config();

interface User {
    userId: string;
    email: string;
    // Add any other fields you expect in the payload
}

interface CustomRequest extends Request {
    user?: User;
}


const verifyToken = (req: CustomRequest, res: Response, next: NextFunction): void => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        res.status(401).json({ message: 'Authorization token is required' });
        return; // Ensure no further code is executed after sending the response
    }

    jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
        if (err) {
            res.status(403).json({ message: 'Invalid or expired token' });
            return; // Ensure no further code is executed after sending the response
        }

        // @ts-ignore - add user data to the request object
        req.user = decoded as User;
        next();
    });
};

app.get('/protected', verifyToken, (req: CustomRequest, res: Response) => {
    res.json({
        message: 'This is a protected route',
        user: req.user, // Access the decoded user info here
    });
});

// Test Route
app.get('/', (req: Request, res: Response) => {
    res.send('API is working!');
});

// Get all users
app.get('/users', async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany();
        res.status(200).json(users);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'An unexpected error occurred' });
        }
    }
});

// Get a specific user by ID
app.get('/users/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = await prisma.user.findUnique({
            where: { id },
        });
        res.status(200).json(user);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'An unexpected error occurred' });
        }
    }
});

// Create a user
app.post('/register', async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { name, email, password: hashedPassword, },
        });
        res.status(201).json(user);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'An unexpected error occurred' });
        }
    }
});

// Get a user by email and password
app.post('/login', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (user && (await bcrypt.compare(password, user.password))) {
            // Generate a JWT token
            const token = jwt.sign({ userId: user.id, email: user.email, name: user.name }, process.env.JWT_SECRET as string, { expiresIn: '10h' });

            // Send the token to the client
            res.status(200).json(token);
        } else {
            res.status(400).json("Invalid email or password.");
        }
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'An unexpected error occurred' });
        }
    }
});

// Create a project
app.post('/projects', async (req: Request, res: Response) => {
    try {
        const { groupName, projectName, description, startDate, endDate, status, ownerId } = req.body;
        const project = await prisma.project.create({
            data: {
                groupName,
                projectName,
                description,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                status,
                owner: { connect: { id: ownerId } },
            },
        });
        res.status(201).json(project);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'An unexpected error occurred' });
        }
    }
});
app.get('/projects/:userId', async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const project = await prisma.project.findMany({
            where: { ownerId: userId }
        });
        res.status(200).json(project);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'An unexpected error occurred' });
        }
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
