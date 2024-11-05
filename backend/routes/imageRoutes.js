import express from 'express';
import multer from 'multer';
import path, { dirname } from 'path';
import fs from 'fs';
import nodemailer from 'nodemailer';
import getEmployeeModel from '../utils/getEmployeeModel.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import sharp from 'sharp'; // Ensure sharp is imported
import sanitize from 'sanitize-filename';

dotenv.config();

const router = express.Router();

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Set up multer storage for image uploads with department-based folder structure
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (!req.session || !req.session.department) {
            return cb(new Error('Department is missing from session'));
        }

        const department = sanitize(req.session.department);
        const dir = path.resolve(__dirname, '../uploads', department);

        // Attempt to create the directory if it doesn't exist
        try {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
                console.log(`Directory created: ${dir}`); // Log directory creation
            }
            cb(null, dir);
        } catch (error) {
            console.error('Error creating directory:', error);
            cb(error);
        }
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Use original filename or create a unique one
    },
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'));
        }
    },
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});

// Middleware to check session for registration data
const ensureRegistrationData = (req, res, next) => {
    const { name, email, department } = req.session || {};
    if (!name || !email || !department) {
        return res.status(400).json({ error: 'Please register before uploading images.' });
    }
    next();
};

// Route to store registration data in session
router.post('/register', (req, res) => {
    const { name, email, department } = req.body;
    if (!name || !email || !department) {
        return res.status(400).json({ error: 'All fields (name, email, department) are required' });
    }

    req.session.name = name;
    req.session.email = email;
    req.session.department = department;

    res.status(200).json({ message: 'Registration successful' });
});

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Function to send email
const sendEmail = (to, subject, text, imagePath) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
        attachments: [
            {
                filename: 'captured_image.png',
                path: imagePath,
            },
        ],
    };

    return transporter.sendMail(mailOptions);
};

// Upload route, protected by session middleware
router.post('/upload', ensureRegistrationData, upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No image file uploaded' });
    }

    try {
        const EmployeeModel = getEmployeeModel(req.session.department);
        
        // Optimize image using sharp
        const optimizedImagePath = path.join('uploads', req.session.department, `optimized-${req.file.filename}`);
        await sharp(req.file.path)
            .resize({ width: 800 })
            .toFile(optimizedImagePath);

        // Update imagePath to use optimized image
        const imagePath = optimizedImagePath;

        // Create a new employee record
        const newEmployee = new EmployeeModel({
            name: req.session.name,
            email: req.session.email,
            department: req.session.department,
            imagePath,
        });

        const savedEmployee = await newEmployee.save();

        // Send email after image upload
        const emailSubject = 'Your Captured Image';
        const emailText = `Hi ${req.session.name},\n\nThank you for using the Virtual Photobooth! Attached is your photo.\n\nBest regards,\nVirtual Photobooth`;
        await sendEmail(req.session.email, emailSubject, emailText, imagePath);

        res.status(200).json({ message: 'Image uploaded and data saved successfully!', data: savedEmployee });
    } catch (error) {
        console.error('Error processing upload:', error.message);
        res.status(500).json({ error: `An error occurred while processing the image: ${error.message}` });
    }
});

export default router;
