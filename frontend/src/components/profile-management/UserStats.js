// Author: [Shubham Mishra]

import React, {useState, useEffect, useContext} from 'react';
import { Typography, Card, CardContent, Grid } from '@mui/material';
import { AuthContext } from '../../services/AuthContext';

const UserStats = () => {
    const { currentUser } = useContext(AuthContext);
    const [userStatistics, setUserStatistics] = useState({
        gamesPlayed: 0,
        gamesWon: 0,
        gamesLost: 0,
        totalPointsEarned: 0,
    });

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await fetch('');
            const data = await response.json();
            setUserStatistics(data);
          } catch (error) {
            console.error('Error fetching user statistics:', error);
          }
        };
    
        fetchData();
      }, []);


  return (
    <div>
      <Typography variant="h4" align="center" gutterBottom>
        User Statistics
      </Typography>

      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Games Played
              </Typography>
              <Typography variant="h4">{userStatistics.gamesPlayed}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total Wins
              </Typography>
              <Typography variant="h4">{userStatistics.gamesWon}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total Losses
              </Typography>
              <Typography variant="h4">{userStatistics.gamesLost}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total Points Earned
              </Typography>
              <Typography variant="h4">{userStatistics.totalPointsEarned}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default UserStats;
