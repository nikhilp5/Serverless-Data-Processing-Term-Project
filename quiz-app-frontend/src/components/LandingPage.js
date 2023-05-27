import React from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(to right, #004d7a, #00c6fb)',
    fontFamily: 'Roboto, sans-serif',
  },
  container: {
    textAlign: 'center',
  },
  button: {
    padding: '15px 30px',
    fontSize: '24px',
    fontWeight: 'bold',
    borderRadius: '5px',
    background: 'linear-gradient(to right, #ff0084, #ff66cc)',
    color: '#fff',
    cursor: 'pointer',
    textDecoration: 'none',
    '&:hover': {
      background: 'linear-gradient(to right, #c70055, #ff0066)',
    },
  },
  text: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: '20px',
  },
}));

const LandingPage = () => {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <Box className={classes.container}>
        <div className={classes.text}>
          Quiz? Quizzer? Quizzest
        </div>
        <Button className={classes.button}>Let's Quiz</Button>
      </Box>
    </Box>
  );
};

export default LandingPage;
