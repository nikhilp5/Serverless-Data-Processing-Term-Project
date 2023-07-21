import React, { useContext, useState } from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import SecurityForm from "./SecurityForm";
import { Typography } from "@mui/material";
import { AuthContext } from '../../services/AuthContext';

const uiConfig = {
  signInFlow: "popup",
  signInOptions: [
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
  ],
  callbacks: {
    signInSuccessWithAuthResult: () => false,
  },
};

const SignIn = () => {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="SignIn">
      {currentUser ? (
        <SecurityForm></SecurityForm>
      ) : (
        <div>
          <Typography variant="h3" component="h3" align="center">
            Sign In
          </Typography>
          <StyledFirebaseAuth
            uiConfig={uiConfig}
            firebaseAuth={firebase.auth()}
          />
        </div>
      )}
    </div>
  );
};

export default SignIn;
