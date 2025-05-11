import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectoDB } from './configs/db.js';
import router from './routes/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
await connectoDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Mount routes
app.use('/api', router);

// Basic route
app.get('/', (req, res) => {
    res.send('Wellcome to the server!');
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port: ${PORT}`);
});