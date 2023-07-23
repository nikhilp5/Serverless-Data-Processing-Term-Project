import React, { useState, useContext, useEffect } from "react";
import { TextField, Grid, Button, Typography, Container } from "@mui/material";
import firebase from "firebase/compat/app";
import { useNavigate } from "react-router-dom";
import { AuthContext } from '../../services/AuthContext';
import axios from 'axios';

const securityAPIEndpoint = 'https://km0vkw6jt0.execute-api.us-east-1.amazonaws.com/test/security';

const SecurityForm = () => {

  const navigate = useNavigate();

  const securityQuestions = [
    "What is your grandfather's first name?",
    "Which is your favourite subject?",
    "Where was your mother born?",
  ];

  const [securityAnswers, setAnswers] = useState(securityQuestions.map(() => ""));
  const [error, setError] = useState("");
  const { setIsSecondFactorAuthDone } = useContext(AuthContext);
  const [isNewUser, setIsNewUser] = useState(false);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    if (currentUser) {
      checkIfuserExists(currentUser.uid)
    }
  }, [currentUser]);

  const checkIfuserExists = async (userId) => {
    const requestData = {
      userId,
      functionName: "checkUserExists"
    };
    try {
      const response = await axios.post(securityAPIEndpoint, requestData);
      const result = response.data;
      const body = JSON.parse(result.body);
      console.log("result-------", result);
      console.log("body-------", body);
  
      if (result.statusCode === 200) {
        handleSetAuthDone();
        if (body.newUser) {
          setIsNewUser(true);
        } else{
          setIsNewUser(false);
        }
      }
    } catch (error) {
      console.error('Error invoking Lambda function:', error);
      setError('Some error occured. Please try again');
    }
  }

  const handleSetAuthDone = () => {
    localStorage.setItem('isSecondFactorAuthDone', JSON.stringify(true));
    setIsSecondFactorAuthDone(true);
  };

  const handleChange = (event, index) => {
    const { value } = event.target;
    setAnswers((prevAnswers) => {
      const updatedAnswers = [...prevAnswers];
      updatedAnswers[index] = value;
      return updatedAnswers;
    });
  };
  
  const invokesecondFactorAuthLambda = async (userId) => {
    const requestData = {
      userId,
      securityAnswers: securityAnswers,
      functionName: "checkSecurityAnswers"
    };
  
    try {
      const response = await axios.post(securityAPIEndpoint, requestData);
      const result = response.data;
      const body = JSON.parse(result.body);
      console.log("result-------", result);
      console.log("body-------", body);
  
      if (result.statusCode === 200) {
        handleSetAuthDone();
        if (body.newUser) {
          navigate("/profile?isNewUser=true");
        } else{
          navigate("/welcomeTeamPage");
        }
      } else if (result.statusCode === 400){
          setError('Security answers do not match.');
        console.error('Lambda function execution failed');
        console.error(result);
      } else {
        setError('Some error occured. Please try again');
      }
    } catch (error) {
      console.error('Error invoking Lambda function:', error);
      setError('Some error occured. Please try again');
    }
  };
  

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const userId = firebase.auth().currentUser.uid;  
    invokesecondFactorAuthLambda(userId);
  };
  

  return (
    <div>
      {isNewUser ? (
        <Typography variant="h6" component="h3" align="center">
          You are a new user: Please answer these security questions.
        </Typography>
      ) : (
        <Typography variant="h6" component="h3" align="center">
          You are an existing user: Please answer the security questions.
        </Typography>
      )
      }
      <br></br>
      <Container>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2} justifyContent="center" alignItems="center">
          {securityQuestions.map((question, index) => (
            <React.Fragment key={index}>
              <Grid item xs={12} md={6}>
                <TextField
                  label={`Security Question ${index + 1}`}
                  value={question}
                  variant="outlined"
                  fullWidth
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label={`Answer ${index + 1}`}
                  value={securityAnswers[index]}
                  onChange={(event) => handleChange(event, index)}
                  variant="outlined"
                  fullWidth
                  required
                />
              </Grid>
            </React.Fragment>
          ))}
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              Submit
            </Button>
          </Grid>
          {error && (
            <Grid item xs={12}>
              <Typography variant="body1" color="error">
                {error}
              </Typography>
            </Grid>
          )}
        </Grid>
      </form>
      </Container>
    </div>
  );
};

export default SecurityForm;
