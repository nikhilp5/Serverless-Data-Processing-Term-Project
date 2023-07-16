import React, { useState } from 'react';
import axios from 'axios';

const { v4: uuidv4 } = require('uuid');

const userId = uuidv4();

const chatbotAPIEndpoint = 'https://km0vkw6jt0.execute-api.us-east-1.amazonaws.com/test/chatbot';

const Chatbot = () => {
  const [userInput, setUserInput] = useState('');
  const [botResponse, setBotResponse] = useState('');

  const handleUserInput = (event) => {
    setUserInput(event.target.value);
  };

  const handleSendMessage = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(chatbotAPIEndpoint, {
        sessionId: userId,
        text: userInput,
      });
      setBotResponse(response.data.body);
    } catch (error) {
      console.error('Error sending message to Lex:', error);
    }
    setUserInput('');
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
