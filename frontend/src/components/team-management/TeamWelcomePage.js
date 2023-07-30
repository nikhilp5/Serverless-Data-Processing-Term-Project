import { Box, Button, Typography, FormControlLabel, Checkbox, Card, CardContent } from '@mui/material';
import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../services/AuthContext';

function TeamWelcomePage() {
  const navigate = useNavigate();
  const [userTeams, setUserTeams] = useState([]);
  const [currentUserEmail, setCurrentUserEmail] = useState('');
  const { currentUser } = useContext(AuthContext);
  const { isAuthenticated } = useContext(AuthContext);
  const [notificationEnabled, setNotificationEnabled] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setCurrentUserEmail(currentUser.email);
      const savedState = localStorage.getItem(`notificationEnabled_${currentUser.email}`);
      setNotificationEnabled(savedState ? JSON.parse(savedState) : false);
    }
  }, [currentUser, isAuthenticated]);

  useEffect(() => {
    localStorage.setItem(`notificationEnabled_${currentUserEmail}`, JSON.stringify(notificationEnabled));
  }, [notificationEnabled, currentUserEmail]);

  useEffect(() => {
    if (currentUserEmail) {
      getTeamDetails();
    }
  }, [currentUserEmail]);

  const getTeamDetails = async () => {
    try {
      const response = await axios.get(`https://sq9k6vbyqf.execute-api.us-east-1.amazonaws.com/test/team-by-user?userEmail=${currentUserEmail}`);
      console.log("This is output", response.data)
      setUserTeams(response.data)
    } catch (error) {
      console.error(error.message);
    }
  };

  const createTeam = async () => {
    try {
      const response = await axios.post(
        'https://sq9k6vbyqf.execute-api.us-east-1.amazonaws.com/test/team',
        {
          userEmail: currentUserEmail
        }
      );
      alert('Team created successfully!');
      alert('Please check your inbox/spam and confirm subscription for team notifications!')
      window.location.reload();
    } catch (error) {
      console.error('Error creating team:', error);
    }
  };

  const viewTeam = (teamId) => {
    navigate('/teamOperations', { state: { teamId: teamId } });
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

  return (
    isAuthenticated ?
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <Box width="50%">
        <Box mb={2}>
          <Typography variant="h6" align="center" gutterBottom>
            Let's create a team to play, let's go!
          </Typography>
        </Box>
        <Box textAlign="center">
          <Button color="success" variant="contained" onClick={createTeam}>
            Create Team
          </Button>
        </Box>
      </Box>
      <Box mt={4} textAlign="center">
        <FormControlLabel
          control={<Checkbox checked={notificationEnabled} onChange={handleNotificationChange} />}
          label="Enable notification if you want others to invite you to their team"
        />
      </Box>
      <Box width="50%">
        <Box mb={2}>
          <Typography variant="h6" align="center" gutterBottom>
            Your Teams
          </Typography>
        </Box>
        {userTeams.map((team, index) => (
          <Card key={index}>
            <CardContent>
              <Typography variant="h5">{team.teamName}</Typography>
              <Button variant="contained" onClick={() => viewTeam(team.teamId)}>
                View Team
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
    :
    <div>Please login to access this page.</div>
  );
}

export default TeamWelcomePage;