import React, { useState, useContext, useEffect } from "react";
import { Grid, Typography, Avatar, TextField, Button, Input } from "@mui/material";
import { useNavigate, Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../services/AuthContext";
import axios from 'axios';


const Profile = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const { isAuthenticated } = useContext(AuthContext);
  const [profileUpdateResponse, setprofileUpdateResponse] = useState("");
  const [isProfileUpdated, setIsProfileUpdated] = useState(false);
  const location = useLocation();
  const isNewUser = new URLSearchParams(location.search).get('isNewUser') === 'true';
  const [error, setError] = useState("");

  const profileAPIEndpoint = 'https://km0vkw6jt0.execute-api.us-east-1.amazonaws.com/test/profile';
  
  const fetchProfile = async () => {
    try {
      const payload = {
        functionName: "getProfile",
        userId: currentUser.uid,
      };
    
      const response = await axios.post(profileAPIEndpoint, payload);
      console.log('response=====', response);
      const data = response.data;
      console.log('-------lambda-----------');

      if (data.statusCode === 200) {
        const profileData = JSON.parse(data.body);

        setName(profileData.name);
        setContactNumber(profileData.contactNumber);
          console.log('image-----',profileData.image);
          setProfilePicture(profileData.image);
          setProfilePictureFile(null);
        console.log('-------lambda-200----------');
      } else {
        console.error("Error fetching profile data");
      }

    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    if (currentUser) {
      console.log('-------hi-----------');
      fetchProfile();
    }
  }, [currentUser, isAuthenticated]);

  const handleNameChange = (e) => {
    setError("");
    setName(e.target.value);
  };

  const handleContactNumberChange = (e) => {
    setContactNumber(e.target.value);
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    setProfilePictureFile(file);
  };

  const handleSaveChanges = async () => {
    if (name.trim() === "") {
      setError("Name cannot be blank.");
      return;
    }
    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        const imageBase64 = event.target.result.split(",")[1];
        const payload = {
          functionName: 'updateProfile',
          userId: currentUser.uid,
          email: currentUser.email,
          name,
          contactNumber,
          image: imageBase64,
        };
      
        const response = await axios.post(profileAPIEndpoint, payload);
        console.log('response=====', response);
        const data = response.data;
        if (data.statusCode === 200) {
          console.log("data.statusCode === 200");
          setprofileUpdateResponse('Profile successfully updated');
          setIsProfileUpdated(true);
        } else {  
          console.log('Error in updating profile');
          setprofileUpdateResponse('Error in updating profile');
        }
      } catch (error) {
        console.error("Error:", error);
        setprofileUpdateResponse('Error in updating profile');
      }
      fetchProfile();

    };

    if (profilePictureFile) {
      reader.readAsDataURL(profilePictureFile);
    } else {
      try {
        const payload = {
          functionName: 'updateProfile',
          userId: currentUser.uid,
          email: currentUser.email,
          name,
          contactNumber,
        };
      
        const response = await axios.post(profileAPIEndpoint, payload);
        console.log('response=====', response);
        const data = response.data;
        if (data.statusCode === 200) {
          console.log("data.statusCode === 200");
          setprofileUpdateResponse('Profile successfully updated');
          setIsProfileUpdated(true);
        } else {  
          console.log('Error in updating profile-----');
          setprofileUpdateResponse('Error in updating profile');
        }
      } catch (error) {
        console.error("Error:", error);
        setprofileUpdateResponse('Error in updating profile-1717171');
      }
      fetchProfile();

    }
  };

  const handleViewStats = () => {
    navigate('/UserStats')
  };

  return isAuthenticated ? (
    <Grid container spacing={2} justifyContent="center" align="center">
      <Grid item xs={12}>
        <Typography variant="h4">Profile</Typography>
      </Grid>
      <Grid item xs={12}>
        {profilePicture && (
          <img
            src={`${profilePicture}?${Date.now()}`}
            alt="Profile"
            style={{ maxHeight: "100px", width: "auto" }}
          />
        )}
      </Grid>
      <Grid item xs={12}>
        <input
          accept="image/*"
          id="profilePictureInput"
          type="file"
          onChange={handleProfilePictureChange}
          style={{ display: "none" }}
        />
        <label htmlFor="profilePictureInput">
          <Button variant="contained" color="primary" component="span">
            Upload Profile Picture
          </Button>
        </label>
      </Grid>
      <Grid item xs={12}>
        {profilePictureFile && (
          <div>
            <h6>New profile picture selected</h6>
            <img
              src={URL.createObjectURL(profilePictureFile)}
              alt="Profile"
              style={{ maxHeight: "100px", width: "auto" }}
            />
          </div>
        )}
      </Grid>
      <Grid item xs={12}>
        <TextField label="Email" value={currentUser.email || ""} disabled />
      </Grid>
      <Grid item xs={12}>
        <TextField label="Name" value={name} onChange={handleNameChange} error={error !== ""}
        helperText={error}/>
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Contact Number"
          value={contactNumber}
          onChange={handleContactNumberChange}
        />
      </Grid>
      <Grid item xs={12}>
        <Button variant="contained" color="primary" onClick={handleSaveChanges}>
          Save Profile Changes
        </Button>
        {profileUpdateResponse && <h6>{profileUpdateResponse}</h6>}
      </Grid>
      {isProfileUpdated && (
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => navigate("/welcomeTeamPage")}
          >
            Go to Home Page
          </Button>
        </Grid>
      )}
      {!isNewUser && (
        <>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleViewStats}
            >
              View statistics
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveChanges}
            >
              Manage team affiliations
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveChanges}
            >
              Leaderboard
            </Button>
          </Grid>
        </>
      )}
    </Grid>
  ) : (
    <div>Please login to access this page.</div>
  );
};

export default Profile;
