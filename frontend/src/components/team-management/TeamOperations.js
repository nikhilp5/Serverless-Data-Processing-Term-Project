import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, TextField, Button, List, ListItem, ListItemText } from '@mui/material';
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
                setTeamName(response.data.teamName);
            } catch (error) {
                console.error('Failed to generate team name:', error);
            }
        };

        generateTeamName();
    }, []);

    return (
        <Box>
            <Grid container justifyContent="center" spacing={2}>
                <Grid item>
                    <Typography variant="h6" align="center">
                        Team Name:
                    </Typography>
                    <TextField
                        variant="outlined"
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        fullWidth
                        disabled
                    />
                </Grid>
            </Grid>
            <Box mt={4}>
                <Typography variant="h6" align="center" gutterBottom>
                    Team Members:
                </Typography>
                <List>
                    {teamMembers.map((member, index) => (
                        <ListItem key={index}>
                            <ListItemText primary={member.name} />
                        </ListItem>
                    ))}
                </List>
            </Box>
            <Box mt={4} display="flex" justifyContent="center" alignItems="flex-end" gap={2}>
                <Button variant="contained" color="primary" onClick={inviteToTeam}>
                    Invite Others
                </Button>
                <Button variant="contained" onClick={viewTeamStatistics}>
                    View Team Statistics
                </Button>
                <Button variant="contained" onClick={leaveTeam}>
                    Leave Team
                </Button>
            </Box>
        </Box>
    );
}

export default TeamOperations;
