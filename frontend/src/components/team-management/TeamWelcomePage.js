import { Box, Button, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
//import { AuthContext } from "../../services/AuthContext";
import { getAuth, onAuthStateChanged } from "firebase/auth";

function TeamWelcomePage() {
    //const { currentUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const [teamName, setTeamName] = useState('');
    const [newTeamId, setNewTeamId] = useState('');
    const [currentUserId, setCurrentUserId] = useState('');

    // Get Team By User ID
    useEffect(() => {

        // get current user
        const auth = getAuth()
        onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log(user.uid)
                setCurrentUserId(user.uid)
                // ...
            } else {
                alert('Sign In to play!')
            }
        })

        console.log("This is ucrrent userrr", currentUserId)
        const getTeamDetails = async () => {
          try {    
            const response = await axios.get(`https://sq9k6vbyqf.execute-api.us-east-1.amazonaws.com/test/team-by-user?userId=${currentUserId}`);
            setNewTeamId(response.data[0].teamId)
            setTeamName(response.data[0].teamName)

          } catch (error) {
            console.error(error.message);
            setTeamName('Error retrieving team name');
          }
        };
        
        if(currentUserId) {
            getTeamDetails()
        }

      }, [currentUserId]);

    // Team is created with the current user as admin
    const createTeam = async () => {
        try {
            // Send a POST request to the API endpoint
            const response = await axios.post(
                'https://sq9k6vbyqf.execute-api.us-east-1.amazonaws.com/test/team',
                {
                    userId: currentUserId
                }
            );
            const newTeamId = response.data.body.teamId;
            setNewTeamId(newTeamId);   
            alert("team created successfully!")
        } catch (error) {
            // Handle any errors that occur during the request
            console.error('Error creating team:', error);
        }
    };    

    const viewTeam = () => {
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
