import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AgreementPage.css';
import logo2 from './assets/logo2.png'; // Update with the actual path of logo 2

const AgreementPage = () => {
    const navigate = useNavigate();

    const handleAccept = () => {
        localStorage.setItem('agreementAccepted', 'true');
        navigate('/register'); // Redirect to the registration page
    };

    const handleDecline = () => {
        navigate('/'); // Redirect to the home page
    };

    return (
        <div className="agreement-container">
            <img src={logo2} alt="Company Logo" className="logo" /> {/* Logo at the top */}
            <h2 className="title">SUSTAINABILITY E-COMMITMENT</h2>
            <p className="subtitle">PHOTO COLLAGE</p>
            <div className="codition">
            <h3 className="agreement-title">Photo Consent & Use Agreement</h3>
              <div className='agreement-list'>
                <p className="description">
                    By participating in this virtual photobooth and submitting your photo, you acknowledge and agree to the following terms:
                </p>
                <ul className="terms-list">
                    <li>
                        <strong>Consent to Capture and Use:</strong> You voluntarily submit your photograph for the purpose of this activity. You grant us permission to use, display, and store your image for event-related purposes, including but not limited to creating a digital mosaic, internal promotions, and other engagement activities.
                    </li>
                    <li>
                        <strong>Ownership and Rights:</strong> You confirm that the photo you submit is your own. By participating, you authorize us to edit, alter, and adapt your image as necessary for the above-mentioned purposes.
                    </li>
                    <li>
                        <strong>Data Privacy:</strong> Your personal information (such as name, email, and department) will be used solely for this event and will not be shared with third parties, except as required by law or to fulfill the purposes described.
                    </li>
                </ul>
                </div>
            </div>
            <div className="button-group">
                <button className="button accept-button" onClick={handleAccept}>Accept</button>
                <button className="button decline-button" onClick={handleDecline}>Decline</button>
            </div>
        </div>
    );
};

export default AgreementPage;
