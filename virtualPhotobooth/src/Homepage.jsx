import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css'; // Import CSS for styling
import logo2 from './assets/logo2.png'; // Import Logo 2
import logo1 from './assets/logo1.png'; // Import Logo 1

const HomePage = () => {
    const navigate = useNavigate();

    const handleNavigateToAgreement = () => {
        navigate('/agreement'); // Redirect to the agreement page
    };

    return (
        <div className="home-container">
            <img src={logo2} alt="Company Logo 2" className="logo" /> {/* Company Logo 2 on top */}
            <h2 className="title">SUSTAINABILITY E-COMMITMENT</h2>
            <p className="subtitle">PHOTO COLLAGE</p>
            <p className="description">We Are Committed To Sustainability</p>
            <img src={logo1} alt="Company Logo 1" className="logo1" /> {/* Company Logo 1 in the middle */}
            <button className="start-button" onClick={handleNavigateToAgreement}>Tap to Start</button>
        </div>
    );
};

export default HomePage;
