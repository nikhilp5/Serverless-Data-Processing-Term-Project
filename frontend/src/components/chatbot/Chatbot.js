import React, { useState } from 'react';
import AWS, { LexRuntimeV2 } from 'aws-sdk';
import {TextField, Button, Input } from "@mui/material";

const { v4: uuidv4 } = require('uuid');

const AWS_CONFIG = {
    "region": process.env.REACT_APP_AWS_REGION,
    "accessKeyId": process.env.REACT_APP_AWS_ACCESS_KEY,
    "secretAccessKey": process.env.REACT_APP_AWS_SECRET_KEY,
    "sessionToken": process.env.REACT_APP_AWS_SESSION_TOKEN,
  };
  
  AWS.config.update(AWS_CONFIG);


const lexRuntime = new LexRuntimeV2({
  region: process.env.REACT_APP_AWS_REGION,
});

const userId = uuidv4();


const Chatbot = () => {
  const [userInput, setUserInput] = useState('');
  const [botResponse, setBotResponse] = useState('');

  const handleUserInput = (event) => {
    setUserInput(event.target.value);
  };

  const handleSendMessage = async (event) => {
    event.preventDefault();

    const params = {
      botId: 'WLHR5ABTFA', 
      botAliasId: 'ZY6QQLPASB', 
      localeId: 'en_US', 
      sessionId: userId,
      text: userInput,
    };

    try {
      const response = await lexRuntime.recognizeText(params).promise();
      const { messages } = response;
      console.log(response);
      const botMessage = messages.find((msg) => msg.contentType === 'PlainText');

      setBotResponse(botMessage.content);
    } catch (error) {
      console.error('Error sending message to Lex:', error);
    }
  };

  return (
    <div>
      <div>Bot Response: {botResponse}</div>
      <form onSubmit={handleSendMessage}>
        <input type="text" value={userInput} onChange={handleUserInput} />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chatbot;