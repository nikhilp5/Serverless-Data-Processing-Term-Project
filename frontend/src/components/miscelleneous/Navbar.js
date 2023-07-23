import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Drawer } from '@mui/material';
import { AccountCircle, Notifications, Android } from '@mui/icons-material';
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { useNavigate } from "react-router-dom";
import Chatbot from '../chatbot/Chatbot';


function Navbar() {
    const [anchorEl, setAnchorEl] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isChatbotOpen, setIsChatbotOpen] = useState(false);

    const navigate = useNavigate();

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleNotificationClick = () => {
        setIsDrawerOpen(true);
    };

    const handleDrawerClose = () => {
        setIsDrawerOpen(false);
    };

    const handleLogout = () => {
        setAnchorEl(null);
        firebase.auth().signOut()
        navigate("/SignIn")
    };

    const handleProfile = () => {
        setAnchorEl(null);
        navigate("Profile")
    };

    const handleChatBotOpen = (event) => {
        setIsChatbotOpen(!isChatbotOpen);
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
                    <IconButton edge="end" color="inherit" aria-label="profile" onClick={handleChatBotOpen}>
                        <Android />
                    </IconButton>
                    <IconButton edge="end" color="inherit" aria-label="profile" onClick={handleMenuOpen}>
                        <AccountCircle />
                    </IconButton>
                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                        <MenuItem onClick={handleProfile}>My Profile</MenuItem>
                        <MenuItem onClick={handleLogout}>Log Out</MenuItem>
                    </Menu>
                </Toolbar>
                {isChatbotOpen && <Chatbot/>}
            </AppBar>
            
            <Drawer anchor="left" open={isDrawerOpen} onClose={handleDrawerClose}>
                {/* Content of the notifications tray */}
                <Typography variant="h6" style={{ padding: '16px' }}>
                    Notifications Tray
                </Typography>
            </Drawer>
        </>
    );
}

export default Navbar;
