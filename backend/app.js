import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';

import morganMiddleware from './middleware/morganMiddleware.js';
import errorMiddleware from './middleware/errorMiddleware.js';
import { ApiError } from './utils/ApiError.js'; 

import authRoutes from './routes/authRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
// import customerRoutes from './routes/customerRoutes.js';
// import riskRoutes from './routes/riskRoutes.js';


dotenv.config();

const app = express();

// --- Core Middleware ---

app.use(rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100, 
    message: 'Too many requests from this IP, please try again after 15 minutes',
    standardHeaders: true, 
    legacyHeaders: false, 
}));

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:8080', 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], 
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true 
}));


app.use(express.json({ limit: '50kb' })); 

app.use(express.urlencoded({ extended: true, limit: '16kb' }));

app.use(cookieParser());

app.use(morganMiddleware);

// --- Routes ---

// Define your API routes
app.use('/api/auth', authRoutes); 
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/customers', customerRoutes); 
// app.use('/api/risk', riskRoutes); // Risk analysis routes

//test 
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Error handling middleware
app.use(errorMiddleware);

export default app;
