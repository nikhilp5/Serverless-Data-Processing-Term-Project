import { Box, Button, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import firebase from "firebase/compat/app";

function TeamWelcomePage() {
    console.log("hrereseesfs", firebase.auth().currentUser.uid)
    const userId = firebase.auth().currentUser.uid
    const navigate = useNavigate();
    const [teamName, setTeamName] = useState('');
    const [newTeamId, setNewTeamId] = useState('');

    // Get Team By User ID
    useEffect(() => {
        const getTeamDetails = async () => {
          try {
            const userId = firebase.auth().currentUser.uid;
    
            const response = await axios.post(
              'https://sq9k6vbyqf.execute-api.us-east-1.amazonaws.com/test/team-by-user', {
                userId: userId
              })
               
            console.log("output teamID", response.data.body[0].teamId)
            console.log("output Team name", response.data.body[0].teamName)
            setNewTeamId(response.data.body[0].teamId)
            setTeamName(response.data.body[0].teamName)

          } catch (error) {
            console.error(error.message);
            setTeamName('Error retrieving team name');
          }
        };
    
        getTeamDetails();
      }, []);

    // Team is created with the current user as admin
    const createTeam = async () => {
        try {
            // Send a POST request to the API endpoint
            const response = await axios.post(
                'https://sq9k6vbyqf.execute-api.us-east-1.amazonaws.com/test/team',
                {
                    userId: userId
                }
            );
            console.log('Team created: with ID', response.data.body.teamId);
            const newTeamId = response.data.body.teamId;
            setNewTeamId(newTeamId);   
            alert("team created successfully!")
        } catch (error) {
            // Handle any errors that occur during the request
            console.error('Error creating team:', error);
        }
    };    

    console.log("This is the team Id that I wil send ->>>>>>>>>", newTeamId)
    const viewTeam = () => {
        console.log("Id sent:::::::", newTeamId)
        navigate('/teamOperations', { state: { teamId: newTeamId } });
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
            {/* Create a new team code */}
            <Box width="50%">
            <Box mb={2}>
            <Typography variant="h6" align="center" gutterBottom>
                Let's create a team to play, let's go!
            </Typography>
            </Box>
            <Box textAlign="center">
            <Button color="success" variant="contained" onClick={createTeam} disabled={!!newTeamId}>
                Create Team
            </Button>
            </Box>
        </Box>
        <Box width="50%">
            <Box mb={2}>
            <Typography variant="h6" align="center" gutterBottom>
                Your Team
            </Typography>
            </Box>
            <Typography variant="body1" align="center">
            Team Name: {teamName}
            </Typography>
            <Box mt={2} textAlign="center">
            <Button variant="contained" onClick={viewTeam} disabled={!teamName || teamName === 'Not part of any team'}>
                View Team
            </Button>
            </Box>
        </Box>

        
        </Box>
    );
}

export default TeamWelcomePage;
