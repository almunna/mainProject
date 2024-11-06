import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './SuccessPage.css';
import logo from './assets/logo2.png'; // Replace with actual path to your logo
import homeIcon from './assets/home.png'; // Replace with actual path to home icon
import photoIcon from './assets/Image.png'; // Replace with actual path to photo icon


const SuccessPage = () => {
    const navigate = useNavigate();
    const location = useLocation(); // Access the current location
    const [overlayedImage, setOverlayedImage] = useState(location.state?.overlayedImage || null); // Retrieve the image from state
    const [errorMessage, setErrorMessage] = useState(''); // State for error messages

    const handleNavigate = (path) => {
        navigate(path);
    };



    return (
        <div className="success-page-container">
            <div className="success-content">
                <img src={logo} alt="Company Logo" className="logo" />
                <h2>Thank you for being part of a bigger picture.</h2>
                <p>We will reveal the photo grid soon.</p>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
            </div>
            <div className="button-row">
                <button onClick={() => handleNavigate('/')} className="icon-button">
                    <img src={homeIcon} alt="Home" />
                    <span>Home</span>
                </button>
                <button onClick={() => handleNavigate('/images')} className="icon-button">
                    <img src={photoIcon} alt="Photo" />
                    <span>Photo</span>
                </button>
        
            </div>
        </div>
    );
};

export default SuccessPage;
