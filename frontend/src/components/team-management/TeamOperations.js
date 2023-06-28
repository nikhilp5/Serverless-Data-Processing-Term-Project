import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, TextField, Button, Card, CardContent } from '@mui/material';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import firebase from "firebase/compat/app";

function TeamOperations() {

    console.log(firebase.auth().currentUser.email, "heeasree")

    const [teamName, setTeamName] = useState('');
    const [teamMembers, setTeamMembers] = useState([]);

    // Get teamId from previous screen
    const location = useLocation();
    const teamId = location.state?.teamId;

    const inviteToTeam = () => {
        // Logic to invite others to the team
    };

    const leaveTeam = () => {
        // Logic to leave the team
    };

    const viewTeamStatistics = () => {
        // Logic to view team statistics
    };

    useEffect(() => {

        console.log("This is the teamId I gettt from beforee screen", teamId)
        const fetchTeamMembers = async () => {
            try {
                const response = await axios.get(`https://sq9k6vbyqf.execute-api.us-east-1.amazonaws.com/test/team/${teamId}`)
                console.log("This is neww response", response)
                setTeamMembers(response.data.body.Items);

            } catch (error) {
                console.error('Failed to fetch team members:', error);
            }
        };
    
        fetchTeamMembers();

        const generateTeamName = async () => {
            // try {
            //     const response = await axios.get('https://api.chagpt.com/team-name');
            //     console.log(response)
            //     setTeamName(response.data.teamName);
            // } catch (error) {
            //     console.error('Failed to generate team name:', error);
            // }
        };

        generateTeamName();

    }, [teamId]);

        return (
            <Box mt={5}>
                <Grid container justifyContent="center" spacing={2}>
                    <Grid item>
                        <Typography variant="h6" align="center"> Your Auto-Generated Team Name: </Typography>
                    </Grid>
                    <Grid item>
                        <TextField value={teamName} onChange={(e) => setTeamName(e.target.value)}/>
                    </Grid>
                </Grid>
            <Box mt={5}>
            <Box sx={{ bgcolor: '', p: 1 }}>
                <Grid container justifyContent="center" spacing={2}>
                    <Grid item>
                        <Card style={{backgroundColor: "lightgreen"}} variant="elevation" align="center">
                        <CardContent>
                            <Typography variant="h6"> 
                            {firebase.auth().currentUser.email} 
                            </Typography>
                            <Typography variant="overline" color="textSecondary">
                                Admin
                            </Typography>
                            <Grid mt={2} container alignItems="center">
                            </Grid>
                        </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
            <Typography mt={4} variant="h6" align="center"> Team Members </Typography>
            <Grid container justifyContent="center" spacing={2}>
                {/* If the user is current user, then ignore!  */}
                {teamMembers.map((member, index) => {
                if (member.userId === firebase.auth().currentUser.uid) {
                    return null; // Skip the first element
                }
                return (
                    <Grid item key={index}>
                        <Card style={{backgroundColor: "lightgreen"}} variant="outlined">
                            <CardContent>
                                <Typography variant="subtitle1"> {member.userId} </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {member.role}
                                </Typography>
                                <Grid mt={2} container alignItems="center">
                                    <Grid item>
                                        {member.role.toLowerCase() === 'admin' ? (
                                            <Button color="secondary">
                                                Demote to Member
                                            </Button>
                                        ) : (
                                            <Button color="primary">
                                                Promote to Admin
                                            </Button>
                                        )}
                                    </Grid>
                                    <Grid item>
                                        <Button color='error'>Kick</Button>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                );
            })}

            </Grid>
            </Box>
            <Box mt={5} mb={5} display="flex" justifyContent="center" alignItems="flex-end" gap={2}>
                <Button variant="contained" color="success" onClick={inviteToTeam}>
                    Invite Others
                </Button>
                <Button variant="contained" color='warning' onClick={viewTeamStatistics}>
                    View Team Statistics
                </Button>
                <Button variant="contained" color='error' onClick={leaveTeam}>
                    Leave Team
                </Button>
            </Box>
            </Box>
    );
}

export default TeamOperations;
