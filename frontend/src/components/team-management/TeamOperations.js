import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, TextField, Button, Card, CardContent, Dialog, DialogTitle, DialogContent, DialogActions, } from '@mui/material';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from "firebase/auth";
//import { AuthContext } from "../../services/AuthContext";

function TeamOperations() {
    //const { currentUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const [teamName, setTeamName] = useState('');
    const [teamMembers, setTeamMembers] = useState([]);
    const [currentUserEmail, setCurrentUserEmail] = useState('');
    const [currentUserRole, setCurrentUserRole] = useState('');

    // Get teamId from previous screen
    const location = useLocation();
    const teamId = location.state?.teamId;
    
    // Invite another user
    const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteMessage, setInviteMessage] = useState('');

    const openInviteDialog = () => {
        setInviteDialogOpen(true);
    };
    
    const closeInviteDialog = () => {
        setInviteDialogOpen(false);
        setInviteEmail('');
    };

    const handleInviteEmailChange = (e) => {
        setInviteEmail(e.target.value);
    };

    const handleInviteMessageChange = (e) => {
        setInviteMessage(e.target.value);
    }

    const sendInvite = async () => {
    try {
        // Create a notification in DynamoDB
        const response = await axios.post(
        'https://sq9k6vbyqf.execute-api.us-east-1.amazonaws.com/test/publish-sns-topic',
        {
            inviteEmail: inviteEmail,
            message: inviteMessage,
            typeOfMessage: 'team invite',
            teamId: teamId,
            teamName: teamName
        });

        console.log('Invite sent successfully:', response.data);
        alert('Invite has been sent!')

        closeInviteDialog();
    } catch (error) {
        console.error('Failed to send invite:', error);
    }
    };

    const viewTeamStatistics = () => {
        // Logic to view team stattistics
    };

    const handleUpdate = async (userEmail, action) => {
        try {
            await axios.put(
                `https://sq9k6vbyqf.execute-api.us-east-1.amazonaws.com/test/team`,
                {
                    teamId: teamId,
                    userEmail: userEmail,
                    action: action,
                }
            );
            if (action === 'updateRole') {
                alert("Role updated successfully!");
            } 
            else if (action === 'kickUser') {
                if (userEmail === currentUserEmail) {
                    alert("You kicked yourself out!");
                    navigate('/welcomeTeamPage')
                } 
                else {
                    alert("User kicked successfully!")
                }
            } 

        } catch (error) {
            console.error('Failed to update user:', error);
        }
    };

    useEffect(() => {
        
        const fetchTeamMembers = async () => {
            try {
                const response = await axios.get(`https://sq9k6vbyqf.execute-api.us-east-1.amazonaws.com/test/team?teamId=${teamId}`)
                setTeamMembers(response.data.teamMembers);
                // Loop through the team members
                response.data.teamMembers.forEach(member => {
                    // If the member's email is the same as the current user's email
                    if(member.userEmail === currentUserEmail) {
                        // Set the current user's role
                        setCurrentUserRole(member.userRole);
                    }
                });

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

        // get current user
        const auth = getAuth()
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUserEmail(user.email)
            } else {
                alert('Sign In to play!')
            }
        })
    }, [teamId, currentUserEmail]);

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
            <Typography mt={4} mb={2} variant="h6" align="center"> Team Members </Typography>
            <Grid container justifyContent="center" spacing={2}>
                {teamMembers.map((member, index) => {
                return (
                    <Grid item key={index}>
                        <Card style={{ backgroundColor: member.userEmail === currentUserEmail ? "greenyellow" : "lightgreen" }} variant="outlined">
                            <CardContent>
                                <Typography variant="subtitle1"> {member.userEmail} </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {member.userRole}
                                </Typography>
                                <Grid mt={2} container alignItems="center">
                                    <Grid item>
                                        {currentUserRole === 'admin' && (
                                            member.userRole.toLowerCase() === 'admin' ? (
                                                <Button color="secondary" onClick={() => handleUpdate(member.userId, 'updateRole')}>
                                                    Demote to Member
                                                </Button>
                                            ) : (
                                                <Button color="primary" onClick={() => handleUpdate(member.userId, 'updateRole')}>
                                                    Promote to Admin
                                                </Button>
                                            )
                                        )}
                                    </Grid>
                                    {/* Render Kick button only if member is not current user */}
                                    <Grid item>
                                        {currentUserRole === 'admin' && (
                                            <Button color='error' onClick={() => handleUpdate(member.userId, 'kickUser')}>Kick</Button>
                                        )}
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
                <Button variant="contained" color="success" onClick={openInviteDialog}>
                    Invite Others
                </Button>
                <Button variant="contained" color='warning' onClick={viewTeamStatistics}>
                    View Team Statistics
                </Button>
                <Button variant="contained" color='error' onClick={() => handleUpdate(currentUserEmail, 'kickUser')}>
                    Leave Team
                </Button>
            </Box>
            <Dialog open={inviteDialogOpen} onClose={closeInviteDialog}>
                <DialogTitle>Invite Others</DialogTitle>
                    <DialogContent>
                        <TextField label="Email Address" value={inviteEmail} onChange={handleInviteEmailChange} fullWidth />
                    </DialogContent>
                    <DialogContent>
                        <TextField label="Message" value={inviteMessage} onChange={handleInviteMessageChange} fullWidth />
                    </DialogContent>
                    <DialogActions>
                        <Button color='error' onClick={closeInviteDialog}>Cancel</Button>
                        <Button onClick={sendInvite} color="success">
                            Send Invite
                        </Button>
                    </DialogActions>
            </Dialog>
        </Box>
    );
}

export default TeamOperations;