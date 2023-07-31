import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, TextField } from '@mui/material';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

function InviteTeamMembers() {
    const [users, setUsers] = useState([]);
    const [teamId, setTeamId] = useState('');
    const [teamName, setTeamName] = useState('');
    const [inviteMessage, setInviteMessage] = useState('You are invited to join our team!'); // Default message
    const location = useLocation();
    const navigate = useNavigate();
    const locationState = location.state || {};
    const { teamId: locationTeamId, teamName: locationTeamName } = locationState;

    useEffect(() => {
        setTeamId(locationTeamId);
        setTeamName(locationTeamName);
        fetchUsers();
        console.log("This is the teamId and name", teamId)
        console.log("Name", teamName)
    }, [locationTeamId, locationTeamName]);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('https://km0vkw6jt0.execute-api.us-east-1.amazonaws.com/test/get-users-profile-info');
            const apiData = JSON.parse(response.data.body)
            setUsers(apiData)
        } catch (error) {
            console.error('Failed to fetch users:', error);
        }
    };

    const sendInvite = async (inviteEmail) => {
        try {
            const response = await axios.post(
            'https://sq9k6vbyqf.execute-api.us-east-1.amazonaws.com/test/publish-sns-topic',
            {
                inviteEmail: inviteEmail,
                message: inviteMessage,
                typeOfMessage: 'team invite',
                teamId: locationTeamId,
                teamName: locationTeamName
            });

            console.log('Invite sent successfully:', response.data);
            alert('Invite has been sent!')
            navigate('/welcomeTeamPage');
        } catch (error) {
            console.error('Failed to send invite:', error);
        }
    };

    return (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" style={{ height: '100vh' }}>
            <Typography variant="h4" align="center">Invite a New Team Member</Typography>
            <Box mt={4}>
                <TextField 
                    label="Invite Message"
                    variant="outlined"
                    fullWidth
                    value={inviteMessage}
                    onChange={e => setInviteMessage(e.target.value)}
                />
                <Box mt={4}>
                    {users.map((user, index) => (
                        <Box my={2} display="flex" justifyContent="center" alignItems="center" key={index}>
                            <Box mr={2} p={2} border={1} borderRadius={4} borderColor="grey.300">
                                <Typography variant="h6">{user.email}</Typography>
                            </Box>
                            <Button variant="contained" color="primary" onClick={() => sendInvite(user.email)}>Send Invite</Button>
                        </Box>
                    ))}
                </Box>
            </Box>
        </Box>
    )
}

export default InviteTeamMembers;