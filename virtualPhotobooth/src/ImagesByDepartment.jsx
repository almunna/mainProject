import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ImagesByDepartment.css';

const ImagesByDepartment = () => {
    const [images, setImages] = useState({});
    const [loading, setLoading] = useState(true);
    const [expandedDepartments, setExpandedDepartments] = useState({});

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/images-by-department', {
                    withCredentials: true,
                });
                setImages(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching images:', error);
                setLoading(false);
            }
        };

        fetchImages();
    }, []);

    const toggleDepartment = (department) => {
        setExpandedDepartments((prev) => ({
            ...prev,
            [department]: !prev[department]
        }));
    };

    // Function to download all images as a .zip file
    const downloadAllImages = () => {
        window.location.href = 'http://localhost:8000/api/download-all';
    };

    if (loading) {
        return <p>Loading images...</p>;
    }

    return (
        <div className="file-explorer-container">
            <div className="header-row">
                <span className="header-cell">Name</span>
                <span className="header-cell">Date Modified</span>
                <span className="header-cell">Type</span>
                <button className="btnSave" onClick={downloadAllImages}>Download All</button>
            </div>
            {Object.keys(images).map((department) => (
                <div key={department} className="department-section">
                    <div className="department-header">
                        <button
                            className="dropdown-button"
                            onClick={() => toggleDepartment(department)}
                        >
                            {expandedDepartments[department] ? "▼" : "▶"} {department}
                        </button>
                    </div>
                    {expandedDepartments[department] && (
                        <div className="department-images">
                            {images[department].map((image, index) => {
                                // Destructure image data
                                const fileName = image.fileName || 'Unknown File';
                                const extension = image.extension || 'Unknown'; // Extension, if available
                                const registeredName = image.registeredName || 'Unknown Registered Name'; // Registered name without extension

                                return (
                                    <div key={index} className="file-row">
                                        {/* Display the file name */}
                                        <span className="file-cell">{fileName}</span>
                                        {/* You can also display `registeredName` if needed */}
                                        <span className="file-cell">{new Date().toLocaleDateString()}</span>
                                        <span className="file-cell">{extension.toUpperCase()}</span>
                                        <div className="file-cell">
                                            <button
                                                className="dropdown-button"
                                                onClick={() => window.open(image.url, "_blank")}
                                            >
                                                View
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ImagesByDepartment;
