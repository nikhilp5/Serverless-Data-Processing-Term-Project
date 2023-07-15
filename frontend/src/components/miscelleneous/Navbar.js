import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Drawer, Card, CardActions, Button, CardContent } from '@mui/material';
import { AccountCircle, Notifications } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import firebase from "firebase/compat/app";

function Navbar() {
    const [anchorEl, setAnchorEl] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [currentUserEmail, setCurrentUserEmail] = useState('');
    const [isLoggedOut, setIsLoggedOut] = useState(false); // Added flag to track logout
    const navigate = useNavigate();

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    // get current user
    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUserEmail(user.email)
                setIsLoggedOut(false); // User is logged in
            } else {
                console.log('Loggedout!')
                setIsLoggedOut(true); // User is logged out
            }
        });

        return () => {
            unsubscribe(); // Cleanup the subscription on unmount
        };
    }, []);

    const handleNotificationClick = async () => {
        if (isLoggedOut) {
            alert('Sign In to play!'); // Show alert only if logged out
            return;
        }
        try {
            const response = await axios.get(`https://sq9k6vbyqf.execute-api.us-east-1.amazonaws.com/test/team-notifications?userEmail=${currentUserEmail}`);
            setNotifications(response.data)
            setIsDrawerOpen(true);
        } catch (error) {
            console.error('Failed to retrieve notifications:', error);
            setNotifications([{type: 'default', message: 'You don\'t have any notifications'}]);
            setIsDrawerOpen(true);
        }
    };

    const handleAcceptInvite = async (teamId) => {
        try {
            await axios.post('https://sq9k6vbyqf.execute-api.us-east-1.amazonaws.com/test/team-notifications', {
                action: 'accept',
                userEmail: currentUserEmail,
                teamId: teamId,
            });
            setNotifications(prevNotifications => ({
                ...prevNotifications,
                messages: prevNotifications.messages.filter(notification => notification.teamId !== teamId),
            }));
            alert('Invite accepted!')
        } catch (error) {
            console.error('Failed to accept invite:', error);
        }
    };    

    const handleDeclineInvite = async (teamId) => {
        try {
            const response = await axios.post('https://sq9k6vbyqf.execute-api.us-east-1.amazonaws.com/test/team-notifications', {
                action: 'decline',
                userEmail: currentUserEmail,
                teamId: teamId,
            });
            console.log('Invite decline response:', response);
            setNotifications(prevNotifications => ({
                ...prevNotifications,
                messages: prevNotifications.messages.filter(notification => notification.teamId !== teamId),
            }));
            alert('Invite declined')
        } catch (error) {
            console.error('Failed to decline invite:', error);
        }
    };

    const handleDrawerClose = () => {
        setIsDrawerOpen(false);
    };

    const handleLogout = () => {
        setAnchorEl(null);
        firebase.auth().signOut()
        setIsLoggedOut(true); // Update the flag to indicate logout
        navigate("/SignIn")
    };

    const handleProfile = () => {
        setAnchorEl(null);
        navigate("Profile");
    };

    return (
        <>
            <AppBar position="static" style={{ background: 'green' }}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="notifications" onClick={handleNotificationClick}>
                        <Notifications />
                    </IconButton>
                    <Typography variant="h6" style={{ flexGrow: 1, textAlign: 'center' }}>
                        Trivia Titans
                    </Typography>
                    {!isLoggedOut && (
                        <>
                            <IconButton edge="end" color="inherit" aria-label="profile" onClick={handleMenuOpen}>
                                <AccountCircle />
                            </IconButton>
                            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                                <MenuItem onClick={handleProfile}>My Profile</MenuItem>
                                <MenuItem onClick={handleLogout}>Log Out</MenuItem>
                            </Menu>
                        </>
                    )}
                </Toolbar>
            </AppBar>
            
            <Drawer anchor="left" open={isDrawerOpen} onClose={handleDrawerClose}>
                <Typography variant="h6" style={{ padding: '16px' }}>
                    Notifications Tray
                </Typography>
                {notifications.messages && notifications.messages.map((message, index) => (
                    <Card key={index} sx={{ maxWidth: 345, margin: '10px' }}>
                        <CardContent>
                            <Typography variant="body2" color="text.secondary">
                                {message.content}
                            </Typography>
                        </CardContent>
                        {message.type === 'team invite' && 
                            <CardActions>
                                <Button size="small" color="primary" onClick={() => handleAcceptInvite(message.teamId)}>
                                    Accept
                                </Button>
                                <Button size="small" color="secondary" onClick={() => handleDeclineInvite(message.teamId)}>
                                    Decline
                                </Button>
                            </CardActions>
                        }
                    </Card>
                ))}
            </Drawer>
        </>
    );
}

export default Navbar;
