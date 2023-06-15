import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, TextField, Button, Card, CardContent } from '@mui/material';
import axios from 'axios';

function TeamOperations() {
    const [teamName, setTeamName] = useState('');
    const [teamMembers, setTeamMembers] = useState([]);

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

        // Generate four fake team members
        const fakeTeamMembers = [
            { name: 'John Doe', role: 'Admin' },
            { name: 'Jane Smith', role: 'Member' },
            { name: 'Michael Johnson', role: 'Member' },
            { name: 'Emily Williams', role: 'Admin' },
            { name: 'John Doe', role: 'Admin' },
            { name: 'Jane Smith', role: 'Member' },
            { name: 'Michael Johnson', role: 'Member' },
            { name: 'Emily Williams', role: 'Admin' },
            { name: 'John Doe', role: 'Admin' },
            { name: 'Jane Smith', role: 'Member' },
            { name: 'Michael Johnson', role: 'Member' },
            { name: 'Emily Williams', role: 'Admin' },
        ];

        setTeamMembers(fakeTeamMembers);
    }, []);

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
        <Typography variant="h6" align="center" gutterBottom> Team Members </Typography>
        <Grid container justifyContent="center" spacing={2}>
            {teamMembers.map((member, index) => (
                <Grid item key={index}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="subtitle1" gutterBottom> {member.name} </Typography>
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
                            <Grid item> <Button color='error'>Kick</Button> </Grid>
                        </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
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
