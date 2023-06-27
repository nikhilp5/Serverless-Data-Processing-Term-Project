import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, TextField, Button, Card, CardContent } from '@mui/material';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

function TeamOperations() {
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

        console.log("This is the teamId I get from before screen", teamId)
        const fetchTeamMembers = async () => {
            try {
                const response = await axios.get('https://w0rtfnxmzh.execute-api.us-east-1.amazonaws.com/test/team', {
                    teamId: teamId
                });
                setTeamMembers(response.data.body.Items);

            } catch (error) {
                console.error('Failed to fetch team members:', error);
            }
        };
    
        fetchTeamMembers();

        const generateTeamName = async () => {
            try {
                const response = await axios.get('https://api.chagpt.com/team-name');
                console.log(response)
                setTeamName(response.data.teamName);
            } catch (error) {
                console.error('Failed to generate team name:', error);
            }
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
            <Card variant="elevation" align="center" gutterBottom>
                <CardContent>
                    <Typography variant="h6" gutterBottom> userId </Typography>
                    <Typography variant="overline" color="textSecondary">
                        Admin
                    </Typography>
                    <Grid mt={2} container alignItems="center">
                    </Grid>
                </CardContent>
                </Card>
            <Typography mt={4} variant="h6" align="center" gutterBottom> Team Members </Typography>
            <Grid container justifyContent="center" spacing={2}>
                {/* The first user in the array is the current user itself.  */}
                {teamMembers.map((member, index) => {
                if (index === 0) {
                    return null; // Skip the first element
                }
                return (
                    <Grid item key={index}>
                        <Card variant="outlined">
                            <CardContent>
                                <Typography variant="subtitle1" gutterBottom> {member.userId} </Typography>
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
