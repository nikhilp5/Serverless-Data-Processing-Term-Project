import React, { useState, useEffect, useCallback, useRef } from 'react';
import Button from '@mui/material/Button';
import ListItemText from '@mui/material/ListItemText';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import CloseIcon from '@mui/icons-material/Close';

const URL = 'wss://badzjszszd.execute-api.us-east-1.amazonaws.com/production';

const ChatBox = ({ onClose }) => {
  const socket = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [members, setMembers] = useState([]);
  const [chatRows, setChatRows] = useState([]);
  const [publicMessage, setPublicMessage] = useState('');
  const [isChatVisible, setIsChatVisible] = useState(true);

  const onSocketOpen = useCallback(() => {
    setIsConnected(true);
    const name = prompt('Enter your name');
    socket.current?.send(JSON.stringify({ action: 'setName', name }));
  }, []);

  const onSocketClose = useCallback(() => {
    setMembers([]);
    setIsConnected(false);
    setChatRows([]);
  }, []);

  const onSocketMessage = useCallback((dataStr) => {
    const data = JSON.parse(dataStr);
    if (data.members) {
      setMembers(data.members);
    } else if (data.publicMessage) {
      setChatRows((oldArray) => [...oldArray, { message: data.publicMessage, sender: data.name }]);
    } else if (data.privateMessage) {
      alert(data.privateMessage);
    } else if (data.systemMessage) {
      setChatRows((oldArray) => [...oldArray, { message: data.systemMessage, system: true }]);
    }
  }, []);

  const onConnect = useCallback(() => {
    if (socket.current?.readyState !== WebSocket.OPEN) {
      socket.current = new WebSocket(URL);
      socket.current.addEventListener('open', onSocketOpen);
      socket.current.addEventListener('close', onSocketClose);
      socket.current.addEventListener('message', (event) => {
        onSocketMessage(event.data);
      });
    }
  }, []);

  useEffect(() => {
    return () => {
      socket.current?.close();
    };
  }, []);

  const onSendPrivateMessage = useCallback((to) => {
    const message = prompt('Enter private message for ' + to);
    socket.current?.send(JSON.stringify({
      action: 'sendPrivate',
      message,
      to,
    }));
  }, []);

  const onSendMessage = useCallback(() => {
    if (publicMessage.trim() !== '') {
      socket.current?.send(JSON.stringify({
        action: 'sendPublic',
        message: publicMessage.trim(),
      }));
      setPublicMessage('');
    }
  }, [publicMessage]);

  const handlePublicMessageKeyPress = (event) => {
    if (event.key === 'Enter') {
      onSendMessage();
    }
  };

  const getUserColor = (name) => {
    const index = members.indexOf(name);
    const colors = ['#ff5252', '#448aff', '#00c853', '#ff6d00', '#ff4081', '#6200ea'];
    return colors[index % colors.length];
  };

  const isMessageSentByCurrentUser = (sender) => {
    return sender === members[0];
  };

  const handleChatVisibility = () => {
    setIsChatVisible((prev) => !prev);
  };

  return (
    <>
      {isChatVisible && (
        <div style={{ position: 'fixed', right: 20, bottom: 20 }}>
          <Paper style={{ width: 350, height: 500, borderRadius: 8, boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px', backgroundColor: '#008000', color: 'white', borderRadius: '8px 8px 0 0' }}>
              <span>Chat Box</span>
              <CloseIcon onClick={handleChatVisibility} style={{ cursor: 'pointer' }} />
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '10px 20px' }}>
              <List component="nav">
                {members.map((item) => (
                  <ListItem key={item} onClick={() => { onSendPrivateMessage(item); }} button>
                    <ListItemText style={{ fontWeight: 800, color: '#008000' }} primary={item} />
                  </ListItem>
                ))}
              </List>
            </div>
            <div style={{ flex: '0 0 auto', borderTop: '1px solid #ccc', backgroundColor: '#f9f9f9', borderRadius: '0 0 8px 8px', padding: '10px' }}>
              <div style={{ maxHeight: 320, overflowY: 'auto' }}>
                <ul style={{ paddingTop: 20, paddingLeft: 44, listStyleType: 'none' }}>
                  {chatRows.map((item, i) => (
                    <li key={i} style={{ paddingBottom: 9, textAlign: isMessageSentByCurrentUser(item.sender) ? 'right' : 'left' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          maxWidth: '70%',
                          padding: '6px 10px',
                          borderRadius: '8px',
                          wordBreak: 'break-word',
                          backgroundColor: isMessageSentByCurrentUser(item.sender) ? getUserColor(item.sender) : '#fff',
                          boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.1)',
                          color: isMessageSentByCurrentUser(item.sender) ? 'white' : 'black',
                          marginRight: isMessageSentByCurrentUser(item.sender) ? '0' : '10px',
                          marginLeft: isMessageSentByCurrentUser(item.sender) ? '10px' : '0',
                        }}
                      >
                        {item.system ? <i>{item.message}</i> : (
                          <span>
                            {isMessageSentByCurrentUser(item.sender) ? 'You' : item.sender}: {item.message}
                          </span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              {isConnected && (
                <>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Enter public message"
                    value={publicMessage}
                    onChange={(e) => setPublicMessage(e.target.value)}
                    onKeyPress={handlePublicMessageKeyPress}
                  />
                  <Button
                    variant="outlined"
                    size="small"
                    disableElevation
                    onClick={onSendMessage}
                  >
                    Send Message
                  </Button>
                </>
              )}
              {!isConnected && (
                <Button
                  variant="outlined"
                  size="small"
                  disableElevation
                  onClick={onConnect}
                >
                  Connect
                </Button>
              )}
            </div>
            <div style={{ position: 'absolute', right: 9, top: 8, width: 12, height: 12, backgroundColor: isConnected ? '#00da00' : '#e2e2e2', borderRadius: 50 }} />
          </Paper>
        </div>
      )}
      {!isChatVisible && (
        <div style={{ position: 'fixed', bottom: 20, right: 20 }}>
          <Button variant="outlined" onClick={handleChatVisibility}>Open Chat</Button>
        </div>
      )}
    </>
  );
};

export default ChatBox;
