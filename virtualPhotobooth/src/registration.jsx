import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo2 from './assets/logo2.png'; 
import './RegistrationForm.css'; // Ensure to import the CSS file

const departments = [
    { name: 'Corporate Planning & Development' },
    { name: 'Digital Business Solutions' },
    { name: 'General Services' },
    { name: 'Human Resources' },
    { name: 'Public Relations & Communication' },
    { name: 'Reservoir & Geosciences' },
    { name: 'Contracts & Procurement' },
    { name: 'Finance' },
    { name: 'Health, Safety, Environment, Quality & Security' },
    { name: 'Major Projects' },
    { name: 'Legal & Governance' },
    { name: 'Operations Planning & Performance' },
    { name: 'Field Operations' },
    { name: 'Engineering & Construction' },
    { name: 'Drilling & Wells' },
    { name: 'Logistics' },
    { name: 'Audit' },
];

const Registration = ({ setUserInfo }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [department, setDepartment] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrorMessage('');

        try {
            const response = await axios.post('http://localhost:8000/api/register', {
                name,
                email,
                department,
            }, {
                withCredentials: true // Ensure this is included
            });

            if (response.status === 200) {
                // Set user info state and navigate to capture image page
                setUserInfo({ name, email, department });
                navigate('/capture-image'); // Navigate to capture image page
            } else {
                setErrorMessage('Registration failed. Please try again.');
            }
        } catch (error) {
            console.error('Registration error:', error.response ? error.response.data : error.message);
            setErrorMessage('Error registering. Please check your connection and try again.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="registration-form-container">
            <img src={logo2} alt="Company Logo" className="logo" style={{ width: '100px', marginBottom: '5px' }} />
            <h2>Register for the Photobooth</h2>
            <div className="mb-3">
                <label htmlFor="nameInput" className="form-label">Name</label>
                <input
                    type="text"
                    className="form-control form-input"
                    id="nameInput"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>
            <div className="mb-3">
                <label htmlFor="emailInput" className="form-label">Email</label>
                <input
                    type="email"
                    className="form-control form-input"
                    id="emailInput"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <div className="mb-3">
                <label htmlFor="departmentSelect" className="form-label">Department</label>
                <select
    className="form-select form-input"
    id="departmentSelect"
    value={department}
    onChange={(e) => setDepartment(e.target.value)}
    required
    style={{ color: department === "" ? "rgb(219, 243, 229)" : "black" }}
>
    <option value="" disabled>
        Select your department
    </option>
    {departments.map((dept, index) => (
        <option key={index} value={dept.name}>
            {dept.name}
        </option>
    ))}
</select>

            </div>
            <button type="submit" className="btn btn-primary">Register</button>
            {errorMessage && <div className="alert alert-danger mt-3">{errorMessage}</div>}
        </form>
    );
};

export default Registration;
