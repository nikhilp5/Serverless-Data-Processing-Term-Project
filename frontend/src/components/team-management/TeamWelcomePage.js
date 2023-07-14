import { Box, Button, Typography, FormControlLabel, Checkbox } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

function TeamWelcomePage() {
  const navigate = useNavigate();
  const [teamName, setTeamName] = useState('');
  const [newTeamId, setNewTeamId] = useState('');
  const [currentUserEmail, setCurrentUserEmail] = useState('');
  const [notificationEnabled, setNotificationEnabled] = useState(false);
  const [teamNotificationsEnabled, setTeamNotificationsEnabled] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserEmail(user.email);
      } else {
        alert('Sign In to play!');
      }
    });

    const getTeamDetails = async () => {
      try {
        const response = await axios.get(`https://sq9k6vbyqf.execute-api.us-east-1.amazonaws.com/test/team-by-user?userEmail=${currentUserEmail}`);
        console.log("This is output", response)
        setNewTeamId(response.data[0].teamId);
        setTeamName(response.data[0].teamName);
      } catch (error) {
        console.error(error.message);
      }
    };

    if (currentUserEmail) {
      getTeamDetails();
    }
  }, [currentUserEmail]);

  const createTeam = async () => {
    try {
      const response = await axios.post(
        'https://sq9k6vbyqf.execute-api.us-east-1.amazonaws.com/test/team',
        {
          userEmail: currentUserEmail
        }
      );
      const newTeamId = response.data.body.teamId;
      setNewTeamId(newTeamId);
      alert('Team created successfully!');
      window.location.reload();
    } catch (error) {
      console.error('Error creating team:', error);
    }
  };

  const viewTeam = () => {
    navigate('/teamOperations', { state: { teamId: newTeamId } });
  };

  const handleNotificationChange = async (event) => {
    const { checked } = event.target;
    setNotificationEnabled(checked);

    try {
        if (checked) {
          // Make a POST request when the checkbox is checked
          const response = await axios.post('https://sq9k6vbyqf.execute-api.us-east-1.amazonaws.com/test/sns-topic', { inviteEmail: currentUserEmail });
          console.log("This is responseeeeeeeeee", response)
          alert('Please confirm the email subscription in your registered email inbox/spam. Thanks!')
          //console.log('Notification enabled and POST request sent.');
        } else {
          // Perform any necessary actions when the checkbox is unchecked
          console.log('Notification disabled.');
        }
    }
    catch (error) {
        console.log(error.message)
    } 
  };

  const handleTeamNotificationChange = async (event) => {
    const { checked } = event.target;
    setTeamNotificationsEnabled(event.target.checked);

    try {
      if (checked) {
        // Make a POST request when the checkbox is checked
        const response = await axios.post('https://sq9k6vbyqf.execute-api.us-east-1.amazonaws.com/test/team-sns-topic', { teamName: teamName, email: currentUserEmail });
        console.log("This is responseeeeeeeeee", response)
        alert('Please confirm the email subscription in your registered email inbox/spam. Thanks!')
        //console.log('Notification enabled and POST request sent.');
      } else {
        // Perform any necessary actions when the checkbox is unchecked
        console.log('Notification disabled.');
      }
  }
  catch (error) {
      console.log(error.message)
  } 
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <Box width="50%">
        <Box mb={2}>
          <Typography variant="h6" align="center" gutterBottom>
            Let's create a team to play, let's go!
          </Typography>
        </Box>
        <Box textAlign="center">
          <Button color="success" variant="contained" onClick={createTeam} disabled={!!newTeamId}>
            Create Team
          </Button>
        </Box>
      </Box>
      <Box width="50%">
        <Box mb={2}>
          <Typography variant="h6" align="center" gutterBottom>
            Your Team
          </Typography>
        </Box>
        <Typography variant="body1" align="center">
          Team Name: {teamName}
        </Typography>
        <Box mt={2} textAlign="center">
          <Button variant="contained" onClick={viewTeam} disabled={!teamName || teamName === 'Not part of any team'}>
            View Team
          </Button>
        </Box>
        <Box mt={2} textAlign="center">
          <FormControlLabel
            control={<Checkbox checked={teamNotificationsEnabled} onChange={handleTeamNotificationChange} />}
            label="Click for your team's notifications"
          />
        </Box>
      </Box>
      <Box mt={4} textAlign="center">
        <FormControlLabel
          control={<Checkbox checked={notificationEnabled} onChange={handleNotificationChange} />}
          label="Enable notification if you want others to invite you to their team"
          disabled={teamName.length > 0}
        />
      </Box>
    </Box>
  );
}

export default TeamWelcomePage;
