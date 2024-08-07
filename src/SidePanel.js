import React from 'react';
import './SidePanel.css';
import { Link } from 'react-router-dom';

function SidePanel({ onClose }) {
  return (
    <div className="sidePanel" onClick={(e) => e.stopPropagation()}>
      <Link to="/login" className="sidePanel__link">
        <button className="sidePanel__Login" onClick={onClose}>Login</button>
      </Link>
      <button className="sidePanel__Signup" onClick={onClose}>Signup</button>
    </div>
  );
}

export default SidePanel;
