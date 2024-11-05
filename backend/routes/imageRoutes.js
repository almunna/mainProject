import express from 'express';
import multer from 'multer';
import path, { dirname } from 'path';
import fs from 'fs';
import nodemailer from 'nodemailer';
import getEmployeeModel from '../utils/getEmployeeModel.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import sharp from 'sharp'; // Ensure sharp is imported

dotenv.config();

const router = express.Router();

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Set up multer storage for image uploads with department-based folder structure
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const department = req.session.department;
        console.log("Session Department:", department); // Log department from session

        if (!department) {
            return cb(new Error('Department is missing from session'));
        }

        const dir = path.join('uploads', department);

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

const upload = multer({ storage });

// Middleware to check session for registration data
const ensureRegistrationData = (req, res, next) => {
    const { name, email, department } = req.session;
    console.log("Session Data:", req.session); // Log the full session data

    if (!name || !email || !department) {
        return res.status(400).json({ error: 'Please register before uploading images.' });
    }
    next();
};

// Route to store registration data in session
router.post('/register', (req, res) => {
    console.log('Incoming registration data:', req.body); // Log the incoming data
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
        user: process.env.EMAIL_USER, // your email address
        pass: process.env.EMAIL_PASS, // your app-specific password
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
                path: imagePath, // path to the image file
            },
        ],
    };

    return transporter.sendMail(mailOptions);
};

// Upload route, protected by session middleware
router.post('/upload', ensureRegistrationData, upload.single('image'), async (req, res) => {
    console.log('Received files:', req.file); // Log received files

    if (!req.file) {
        return res.status(400).json({ error: 'No image file uploaded' });
    }

    try {
        const EmployeeModel = getEmployeeModel(req.session.department);
        const imagePath = req.file.path; // Uploaded image path

        // Create a new employee record with additional information
        const newEmployee = new EmployeeModel({
            name: req.session.name, // Get name from the session
            email: req.session.email, // Get email from the session
            department: req.session.department, // Get department from the session
            imagePath: imagePath, // Save uploaded image path
        });

        const savedEmployee = await newEmployee.save();

        // Send email after image upload
        const emailSubject = 'Your Captured Image';
        const emailText = `Hi ${req.session.name},\n\nThank you for using the Virtual Photobooth! Attached is your photo.\n\nBest regards,\nVirtual Photobooth`;
        await sendEmail(req.session.email, emailSubject, emailText, imagePath); // Send email with user email

        res.status(200).json({ message: 'Image uploaded and data saved successfully!', data: savedEmployee });
    } catch (error) {
        console.error('Error processing upload:', error.message);
        res.status(500).json({ error: `An error occurred while processing the image: ${error.message}` });
    }
});

export default router;
