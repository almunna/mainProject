import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import imageRoutes from './routes/imageRoutes.js';
import path from 'path';
import multer from 'multer';
import fs from 'fs';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;
const __dirname = path.resolve();

// Middleware
app.use(cors({
    origin: 'https://mainproject-glmp.onrender.com', // Adjust to your frontend URL
    credentials: true // Allow cookies to be sent
}));
app.use(express.json()); // Parse JSON bodies
app.use('/uploads', express.static('uploads')); // Serve static files from 'uploads' directory

// Configure session middleware
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key', // Use a secure key
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }), // Use MongoDB for session storage
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Storage configuration for multer to handle department folders
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const department = req.body.department; // Assuming department is sent in the request body
        const uploadPath = `uploads/${department}`;

        // Create directory for department if it doesn't exist
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

// Endpoint to handle file uploads by department
app.post('/api/upload', upload.single('photo'), (req, res) => {
    try {
        res.status(200).json({
            message: 'File uploaded successfully',
            filePath: `/uploads/${req.body.department}/${req.file.filename}`
        });
    } catch (err) {
        res.status(500).json({ error: 'Error uploading file' });
    }
});

// Use imageRoutes for handling registration and other image operations
app.use('/api', imageRoutes);

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

// Serve static files for the frontend
app.use(express.static(path.join(__dirname, "/virtualPhotobooth/dist")));
app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "virtualPhotobooth", "dist", "index.html"));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error occurred:', err);
    res.status(500).json({ error: err.message || 'Internal Server Error' });
});
