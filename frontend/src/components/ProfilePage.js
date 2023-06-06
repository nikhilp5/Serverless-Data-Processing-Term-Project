import React, { useState } from 'react';
import Profile from './Profile';
import ProfileEdit from './ProfileEdit';
import firebase from 'firebase/compat/app';

const ProfilePage = () => {
  const initialProfileData = {
    name: 'John Doe',
    email: 'johndoe@example.com',
    profilePicture: 'profile.jpg',
  };

  const [editing, setEditing] = useState(false);
  const [profileData, setProfileData] = useState(initialProfileData);

  const handleEditClick = () => {
    setEditing(true);
  };

  const handleSaveClick = (updatedProfile) => {
    setProfileData(updatedProfile);
    setEditing(false);
  };

  return (
    <div>
      <button onClick={() => firebase.auth().signOut()}>Sign out</button>
      {editing ? (
        <ProfileEdit
          profileData={profileData}
          onSaveClick={handleSaveClick}
        />
      ) : (
        <Profile
          profileData={profileData}
          onEditClick={handleEditClick}
        />
      )}
    </div>
  );
};

export default ProfilePage;
