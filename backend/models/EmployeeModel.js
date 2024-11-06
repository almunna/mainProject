// backend/models/EmployeeModel.js
import mongoose from 'mongoose';
import employeeSchema from './Employee.js';

const EmployeeModel = mongoose.model('Employee', employeeSchema);

export default EmployeeModel;
