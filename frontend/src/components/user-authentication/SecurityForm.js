import React, { useState } from "react";
import { TextField, Grid, Button, Typography } from "@mui/material";
import firebase from "firebase/compat/app";
import AWS from "aws-sdk";
import { useNavigate } from "react-router-dom";

const AWS_CONFIG = {
  "region": process.env.REACT_APP_AWS_REGION,
  "accessKeyId": process.env.REACT_APP_AWS_ACCESS_KEY,
  "secretAccessKey": process.env.REACT_APP_AWS_SECRET_KEY,
  "sessionToken": process.env.REACT_APP_AWS_SESSION_TOKEN,
};

AWS.config.update(AWS_CONFIG);

const dynamodb = new AWS.DynamoDB.DocumentClient();;

const SecurityForm = () => {

  const navigate = useNavigate();

  const securityQuestions = [
    "What is your grandfather's first name?",
    "Which is your favourite subject?",
    "Where was your mother born?",
  ];

  const [answers, setAnswers] = useState(securityQuestions.map(() => ""));
  const [error, setError] = useState("");

  const handleChange = (event, index) => {
    const { value } = event.target;
    setAnswers((prevAnswers) => {
      const updatedAnswers = [...prevAnswers];
      updatedAnswers[index] = value;
      return updatedAnswers;
    });
  };

  const fetchUserAnswers = (userId) => {
    const params = {
      TableName: 'security_questions',
      Key: {
        userId: userId,
      },
    };
  
    return new Promise((resolve, reject) => {
      dynamodb.get(params, (err, data) => {
        if (err) {
          reject(err);
        } else {
          const item = data.Item;
          if (item && item.securityAnswers) {
            resolve(item.securityAnswers);
          } else {
            reject(new Error('Security answers not found'));
          }
        }
      });
    });
  };
  

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const userId = firebase.auth().currentUser.uid;
  
    try {
      const existingAnswers = await fetchUserAnswers(userId);
  
      if (existingAnswers.every((answer, index) => answer === answers[index])) {
        navigate("/welcome");
      } else {
        setError('Security answers do not match.');
      }
    } catch (error) {
      const params = {
        TableName: 'security_questions',
        Item: {
          userId: userId,
          securityAnswers: answers,
        },
      };
  
      dynamodb.put(params, (err) => {
        if (err) {
          console.error('Error saving to DynamoDB:', err);
        } else {
          console.log('Security answers saved to DynamoDB successfully');
          navigate("/welcome");
        }
      });
    }
  };
  

  return (
    <div>
      <Typography variant="h3" component="h3" align="center">
        Security Questions
      </Typography>
      <br></br>
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
                  value={answers[index]}
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
    </div>
  );
};

export default SecurityForm;
