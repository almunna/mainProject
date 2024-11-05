import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CaptureImage from './CaptureImage';

const VirtualPhotobooth = () => {
    const [userInfo, setUserInfo] = useState({
        name: '',
        email: '',
        department: ''
    });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleRegister = async () => {
        // Assume registration logic is implemented here
        // After registration, save user information
        setUserInfo({ name: 'John Doe', email: 'john@example.com', department: 'Marketing' }); // Example values
        navigate('/capture'); // Navigate to capture photo page
    };

    return (
        <div className="text-center mt-5">
            <h1>Welcome to the Virtual Photobooth!</h1>
            <p>Capture your memories in a fun and interactive way!</p>
            <button onClick={handleRegister} className="action-button">Register</button>
            {message && <p className="mt-3">{message}</p>}
            {/* Add the CaptureImage component */}
            <CaptureImage userInfo={userInfo} />
        </div>
    );
};

export default VirtualPhotobooth;
