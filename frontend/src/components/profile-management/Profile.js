import React from 'react';

const Profile = ({ profileData, onEditClick }) => {
  const { name, email, profilePicture } = profileData;

  return (
    <div className='container'>
      <div className='row'>
        <img src={profilePicture} alt="Profile" />
      </div>
      <div className='row'>
        <p>Name: {name}</p>
      </div>
      <div className='row'>
        <p>Email: {email}</p>
      </div>
      <button onClick={onEditClick}>Edit Profile</button>
    </div>
  );
};

export default Profile;
