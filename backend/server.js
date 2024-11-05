import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import imageRoutes from './routes/imageRoutes.js';
import path from 'path';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;
const __dirname = path.resolve();

// Middleware
app.use(cors({
    origin: 'http://localhost:5173', // Adjust to your frontend URL
    credentials: true // Allow cookies to be sent
}));
app.use(express.json()); // Parse JSON bodies
app.use('/uploads', express.static('uploads')); // Serve static files from 'uploads' directory

// Configure session middleware
// Session configuration in server.js
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key', // Use a secure key
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }), // Use MongoDB for session storage
    cookie: { secure: false } // Set to true if using HTTPS
}));


// Use imageRoutes for handling registration and image upload
app.use('/api', imageRoutes); // Mounting imageRoutes

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('MongoDB connected successfully');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
    });

app.use(express.static(path.join(__dirname, "/virtualPhotobooth/dist")));
app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "virtualPhotobooth", "dist", "index.html"));
    })

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error occurred:', err);
    res.status(500).json({ error: err.message || 'Internal Server Error' });
});
