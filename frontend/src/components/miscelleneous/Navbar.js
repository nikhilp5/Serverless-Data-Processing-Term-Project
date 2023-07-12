import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Drawer } from '@mui/material';
import { AccountCircle, Notifications } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";

function Navbar() {
    const [anchorEl, setAnchorEl] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [currentUserEmail, setCurrentUserEmail] = useState('');
    const navigate = useNavigate();

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    // get current user
    useEffect(() => {
        // get current user
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log(user.email)
                setCurrentUserEmail(user.email)
            } else {
                alert('Sign In to play!')
            }
        });

        return () => {
            unsubscribe(); // Cleanup the subscription on unmount
        };
    }, []);

    const handleNotificationClick = async () => {
        try {
            console.log("From Navbar, here is the", currentUserEmail)
            // Hit the Axios GET endpoint to retrieve the list of notifications
            const response = await axios.get(`https://sq9k6vbyqf.execute-api.us-east-1.amazonaws.com/test/teaminvites?userEmail=${currentUserEmail}`);
            console.log("Heyyyyyyy", response)
            const notificationsData = response.data;
            console.log("getting this bro", notificationsData)
            setNotifications(notificationsData); // Update the state with the notifications

            setIsDrawerOpen(true);
        } catch (error) {
            console.error('Failed to retrieve notifications:', error);
        }
    };

    const handleDrawerClose = () => {
        setIsDrawerOpen(false);
    };

    const handleLogout = () => {
        setAnchorEl(null);
        // Your logout logic here
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
                    <IconButton edge="end" color="inherit" aria-label="profile" onClick={handleMenuOpen}>
                        <AccountCircle />
                    </IconButton>
                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                        <MenuItem onClick={handleProfile}>My Profile</MenuItem>
                        <MenuItem onClick={handleLogout}>Log Out</MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>
            
            <Drawer anchor="left" open={isDrawerOpen} onClose={handleDrawerClose}>
                {/* Content of the notifications tray */}
                <Typography variant="h6" style={{ padding: '16px' }}>
                    Notifications Tray
                </Typography>
                {/* Render the list of notifications */}
                {notifications.map((notification, index) => (
                    <Typography key={index}>{notification}</Typography>
                ))}
            </Drawer>
        </>
    );
}

export default Navbar;
