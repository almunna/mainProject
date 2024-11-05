// backend/models/Employee.js
import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    department: { type: String, required: true },
    imagePath: { type: String, required: true } // Path in department-wise folder
});

export default employeeSchema; // Export only the schema
