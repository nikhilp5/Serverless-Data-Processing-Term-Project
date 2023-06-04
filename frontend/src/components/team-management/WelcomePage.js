import { Box, Button, Typography } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';

function WelcomePage() {
    return (
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="100vh">
            <Box mb={2}>
                <Typography variant="h6" align="center" gutterBottom>
                    Let's create a team to Play!
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