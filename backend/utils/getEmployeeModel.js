// backend/utils/getEmployeeModel.js
import mongoose from 'mongoose';
import employeeSchema from '../models/Employee.js';

const getEmployeeModel = (department) => {
    // Normalize department name to avoid invalid characters in collection names
    const collectionName = department.toLowerCase().replace(/\s+/g, '_'); // e.g., "Engineering" => "engineering"

    // Log the collection name being used
    console.log('Using collection:', collectionName);

    // Check if model already exists; if not, create a new one
    if (!mongoose.models[collectionName]) {
        console.log(`Creating new model for collection: ${collectionName}`);
        mongoose.model(collectionName, employeeSchema, collectionName); // Third argument is the collection name
    } else {
        console.log(`Reusing existing model for collection: ${collectionName}`);
    }

    return mongoose.model(collectionName); // Return the model for this collection
};

export default getEmployeeModel;
