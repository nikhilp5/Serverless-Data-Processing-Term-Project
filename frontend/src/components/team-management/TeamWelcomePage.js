import { Box, Button, Typography } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import firebase from "firebase/compat/app";

function TeamWelcomePage() {
    console.log("hrereeeeeeeeeeeeeeeeeeeeeee", firebase.auth().currentUser.uid)
    const navigate = useNavigate();

    // Team is created with the current user as admin
    const createTeam = async () => {
        const userId = firebase.auth().currentUser.uid
        try {
            // Send a POST request to the API endpoint
            const response = await axios.post(
                'https://w0rtfnxmzh.execute-api.us-east-1.amazonaws.com/test/team',
                {
                    userId: userId
                }
            );
            console.log('Team created:', response.data.body.teamId);   
            const newTeamId = response.data.body.teamId
            navigate('/teamOperations', { state: { teamId: newTeamId } }); // Navigate to the next screen and pass teamId as state
        } catch (error) {
            // Handle any errors that occur during the request
            console.error('Error creating team:', error);
        }
    };    

    const viewTeam = () => {
        // Code to view the user's team
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">

        <Box width="50%">
            <Box mb={2}>
            <Typography variant="h6" align="center" gutterBottom>
                Your Team
            </Typography>
            </Box>
            <Typography variant="body1" align="center">
            Team Name: Example Team
            </Typography>
            <Box mt={2} textAlign="center">
            <Button variant="contained" onClick={viewTeam}>
                View Team
            </Button>
            </Box>
        </Box>

            {/* Create a new team code */}
        <Box width="50%">
            <Box mb={2}>
            <Typography variant="h6" align="center" gutterBottom>
                Let's create a team to play, let's go!
            </Typography>
            </Box>
            <Box textAlign="center">
            <Button color="success" variant="contained" onClick={createTeam}>
                Create Team
            </Button>
            </Box>
        </Box>
        </Box>
    );
}

export default TeamWelcomePage;
