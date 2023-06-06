import React, { useState } from 'react';

const ProfileEdit = ({ profileData, onSaveClick }) => {
  const [name, setName] = useState(profileData.name);
  const [email, setEmail] = useState(profileData.email);

  const handleSaveClick = () => {
    const updatedProfile = {
      name,
      email,
    };

    onSaveClick(updatedProfile);
  };

  return (
    <div>
      <div>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <button onClick={handleSaveClick}>Save</button>
    </div>
  );
};

export default ProfileEdit;
