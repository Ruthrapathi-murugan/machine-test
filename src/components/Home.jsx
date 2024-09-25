import React from 'react';
import './App.css'; // This is correct if the file is in the same folder


function Home() {
  return (
    <div className="home-container">
      <h1>Welcome to the Home Page</h1>
      <p>This is a simple, clean homepage  designed for a machine test.</p>
      <button className="home-button">Explore More</button>
    </div>
  );
}

export default Home;
