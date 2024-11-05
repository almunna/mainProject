import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Webcam from 'react-webcam';
import './CaptureImage.css';

const CaptureImage = ({ userInfo }) => {
    const [image, setImage] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const webcamRef = useRef(null);
    const navigate = useNavigate();

    // Capture image from webcam
    const captureImage = () => {
        const imageSrc = webcamRef.current.getScreenshot();
        setImage(imageSrc);
    };

    // Retake image
    const handleRetake = () => {
        setImage(null);
        setSuccessMessage('');
        setErrorMessage('');
    };

    // Handle image upload
    const handleUpload = async () => {
        if (!image) {
            setErrorMessage('Please capture an image before uploading.');
            return;
        }

        // Convert the captured image to a Blob
        const response = await fetch(image);
        const blob = await response.blob();
        const formData = new FormData();
        formData.append('image', blob, 'captured_image.png'); // Append captured image

        // Append user information to formData
        formData.append('name', userInfo.name);
        formData.append('email', userInfo.email);
        formData.append('department', userInfo.department);

        try {
            const res = await axios.post('http://localhost:8000/api/upload', formData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (res.status === 200) {
                setSuccessMessage('Image uploaded successfully! An email with your photo has been sent to you.');
                setTimeout(() => {
                    navigate('/register'); // Redirect to registration or another page
                }, 2000);
            }
        } catch (error) {
            console.error('Image upload error:', error); // Log the error for debugging
            setErrorMessage('Failed to upload image. Please try again.');
        }
    };

    return (
        <div className="capture-container">
            <h2 className="title">SUSTAINABILITY E-COMMITMENT</h2>
            <p className="subtitle">PHOTO COLLAGE</p>
            <div className="webcam-container">
                {!image ? (
                    <Webcam
                        ref={webcamRef}
                        audio={false}
                        screenshotFormat="image/png"
                        mirrored={false}  // Disable mirroring
                        className="webcam"
                    />
                ) : (
                    <div className="captured-image-container">
                        <img src={image} alt="Captured" className="captured-image" />
                    </div>
                )}
            </div>
            {successMessage && <div className="success-message">{successMessage}</div>}
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            <div className="button-container">
                {!image ? (
                    <button onClick={captureImage} className="action-button capture-button">
                        📸
                    </button>
                ) : (
                    <>
                        <button onClick={handleRetake} className="action-button back-button">
                            🔄
                        </button>
                        <button onClick={handleUpload} className="action-button submit-button">
                            ✔️
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default CaptureImage;
