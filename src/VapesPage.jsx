// VapesPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './VapesPage.css'; // Add a new CSS file for styling

function VapesPage() {
  const navigate = useNavigate();

  const vapeOptions = [
    { name: 'Shop Raz', image: 'path/to/raz.jpg' },
    { name: 'Shop Geekbar', image: 'path/to/geekbar.jpg' },
    // Add more options as needed
  ];

  return (
    <div className="vapesPage">
      <button className="backButton" onClick={() => navigate(-1)}>
        Back
      </button>
      <div className="vapesPage__options">
        {vapeOptions.map((option, index) => (
          <div key={index} className="vapesPage__option">
            <img
              src={option.image}
              alt={option.name}
              className="vapesPage__optionImage"
            />
            <div className="vapesPage__optionOverlay">
              <span className="vapesPage__optionName">{option.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default VapesPage;
