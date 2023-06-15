import React, { useState } from "react";
import { Grid, Typography, Avatar, TextField, Button, Input } from "@mui/material";
import firebase from "firebase/compat/app";


const Profile = () => {
  const [name, setName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [profilePicture, setProfilePicture] = useState("");

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleContactNumberChange = (e) => {
    setContactNumber(e.target.value);
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      setProfilePicture(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = () => {
  };

  return (
    <Grid container spacing={2} justifyContent="center" align="center" >
      <Grid item xs={12}>
        <Typography variant="h4">Profile</Typography>
      </Grid>
      <Grid item xs={12}> 
        <Avatar
          src={profilePicture}
          alt="Profile Picture"
          sx={{ width: 200, height: 200 }}
        />
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
        <TextField label="Email" value={firebase.auth().currentUser?.email || ''} disabled/>
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
      </Grid>
      <Grid item xs={12}>
        <Button variant="contained" color="primary" onClick={handleSaveChanges}>
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
  );
};

export default Profile;
