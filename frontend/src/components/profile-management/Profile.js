import React, { useState, useContext, useEffect } from "react";
import { Grid, Typography, Avatar, TextField, Button, Input } from "@mui/material";
import { useNavigate, Navigate } from "react-router-dom";
import { AuthContext } from "../../services/AuthContext";
import AWS from "aws-sdk";
import { convertLength } from "@mui/material/styles/cssUtils";
const logo = require('../../images/profile.png');


const AWS_CONFIG = {
  "region": process.env.REACT_APP_AWS_REGION,
  "accessKeyId": process.env.REACT_APP_AWS_ACCESS_KEY,
  "secretAccessKey": process.env.REACT_APP_AWS_SECRET_KEY,
  "sessionToken": process.env.REACT_APP_AWS_SESSION_TOKEN,
};

AWS.config.update(AWS_CONFIG);

const lambda = new AWS.Lambda({ region: process.env.REACT_APP_AWS_REGION });

const Profile = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const [profileUpdateResponse, setprofileUpdateResponse] = useState("");
  const [isLoading, setIsLoading] = useState(true);


  const fetchProfile = async () => {
    try {
      const params = {
        FunctionName: "profile",
        Payload: JSON.stringify({
          functionName: "getProfile",
          userId: currentUser.uid,
        }),
      };

      const data = await lambda.invoke(params).promise();
      console.log('-------lambda-----------');

      if (data.StatusCode === 200) {
        const profileData = JSON.parse(JSON.parse(data.Payload).body);

        setName(profileData.name);
        setContactNumber(profileData.contactNumber);
        // if (profileData.image === '') {
          console.log('defaultimage-----',profileData.image);
          setProfilePicture(profileData.image);
        // } else {
        //   setProfilePicture(profileData.image);
        // }
        console.log('-------lambda-200----------');
      } else {
        console.error("Error fetching profile data");
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Error:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {

    if (currentUser) {
      console.log('-------hi-----------');
      fetchProfile();
    }
  }, [currentUser]);

  const handleNameChange = (e) => {
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
    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        const imageBase64 = event.target.result.split(",")[1];
        const params = {
          FunctionName: "profile",
          Payload: JSON.stringify({ functionName: 'updateProfile',  userId: currentUser.uid, name, contactNumber, image: imageBase64}),
        };

        const data = await lambda.invoke(params).promise();
        if (data.StatusCode === 200) {
          console.log("data.StatusCode === 200");
          setprofileUpdateResponse('Profile successfully updated');
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
        const params = {
          FunctionName: "profile",
          Payload: JSON.stringify({ functionName: 'updateProfile',  userId: currentUser.uid, name, contactNumber}),
        };

        const data = await lambda.invoke(params).promise();
        if (data.StatusCode === 200) {
          console.log("data.StatusCode === 200");
          setprofileUpdateResponse('Profile successfully updated');
        } else {  
          console.log('Error in updating profile');
          setprofileUpdateResponse('Error in updating profile');
        }
      } catch (error) {
        console.error("Error:", error);
        setprofileUpdateResponse('Error in updating profile');
      }
      fetchProfile();

    }
  };

  const handleViewStats = () => {
    navigate('/UserStats')
  };

  return (
    currentUser ?
    <Grid container spacing={2} justifyContent="center" align="center" >
      <Grid item xs={12}>
        <Typography variant="h4">Profile</Typography>
      </Grid>
      <Grid item xs={12}> 
        {profilePicture && <img
          src={`${profilePicture}?${Date.now()}`}
          alt="Profile"
          style={{ maxHeight: "100px", width: "auto" }}
        />}
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
        <TextField label="Email" value={currentUser.email || ''} disabled/>
      </Grid>
      <Grid item xs={12}>
        <TextField label="Name" value={name} onChange={handleNameChange} />
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
        {profileUpdateResponse  && <h6>{profileUpdateResponse}</h6>}
      </Grid>
      <Grid item xs={12}>
        <Button variant="contained" color="primary" onClick={handleViewStats}>
          View statistics
        </Button>
      </Grid>
      <Grid item xs={12}>
        <Button variant="contained" color="primary" onClick={handleSaveChanges}>
          Manage team affiliations
        </Button>
      </Grid>
      <Grid item xs={12}>
        <Button variant="contained" color="primary" onClick={handleSaveChanges}>
          Leaderboard
        </Button>
      </Grid>
    </Grid>
    :
      <div>Loading...</div>
  );
};

export default Profile;
