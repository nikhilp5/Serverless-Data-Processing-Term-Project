import { Box, Button, Typography } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';

function WelcomePage() {
    return (
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="100vh">
            <Box mb={2}>
                <Typography variant="h5" align="center" gutterBottom>
                    Instructions: This game requires you to be part of a team
                </Typography>
            </Box>
            <Link to="/teamOperations">
                <Button color="success"variant="contained">
                    Create Team
                </Button>
            </Link>
        </Box>
    );
}

export default WelcomePage;