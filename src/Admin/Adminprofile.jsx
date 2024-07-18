import React from 'react';
import './Adminprofile.css';
import profile from "../Images/profile.jpeg"
const Adminprofile = () => {
  return (
    <div className="profile-container">
      <div className="profile-header">
        <img src={profile} alt="Profile" className="profile-pic" />
        <div className="profile-info">
          <h1>Admin</h1>
          <p>admin@admin.com</p>
        </div>
      </div>
      <div className="profile-nav">
        <button className="nav-button active">About</button>
        <button className="nav-button">Password</button>
      </div>
      <div className="profile-details">
        <div className="details-header">
          <h2>Personal Details</h2>
          <button className="edit-button">Edit</button>
        </div>
        <div className="details-content">
          <p><strong>Name:</strong> Admin Sakshi</p>
          <p><strong>Email ID:</strong> admin@admin.com</p>
          <p><strong>User Role:</strong> Super-admin Sales-person</p>
        </div>
      </div>
    </div>
  );
}

export default Adminprofile;
