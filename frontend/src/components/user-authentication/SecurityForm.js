import React, { useState } from "react";
import { TextField, Grid, Button, Typography } from "@mui/material";
import firebase from "firebase/compat/app";

const SecurityForm = () => {
  const securityQuestions = [
    "What is your grandfather's first name?",
    "Which is your favourite subject?",
    "Where was your mother born?",
  ];

  const [answers, setAnswers] = useState(securityQuestions.map(() => ""));

  const handleChange = (event, index) => {
    const { value } = event.target;
    setAnswers((prevAnswers) => {
      const updatedAnswers = [...prevAnswers];
      updatedAnswers[index] = value;
      return updatedAnswers;
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Do something with the answers (e.g., validate, send to server, etc.)
    console.log(answers);
  };

  return (
    <div>
      <button onClick={() => firebase.auth().signOut()}>Sign out</button>
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
        </Grid>
      </form>
    </div>
  );
};

export default SecurityForm;
