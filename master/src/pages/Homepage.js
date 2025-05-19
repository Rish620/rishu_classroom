import React from 'react';
import './Homepage.css'; // Make sure to create this CSS file

const Homepage = () => {
  return (
    <div className="homepage-container">
      <div className="overlay">
        <div className="homepage-content">
          <h1>Welcome to Our Platform</h1>
          <p>Explore classrooms, collaborate, and learn together!</p>
          <button className="explore-btn">Get Started</button>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
