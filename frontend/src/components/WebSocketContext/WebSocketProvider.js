import React, { useCallback, useEffect, useRef, useState } from 'react';
import { json } from 'react-router-dom';

export const WebSocketContext = React.createContext(null);

export default ({ children }) => {
	let ws = useRef(null);
	const [webSocket, setWebSocket] = useState(null);
	const [message, setMessage] = useState(null);
	const wsApi = 'wss://rireb5nnb2.execute-api.us-east-1.amazonaws.com/dev';

	const handleMessage = useCallback((messageEvent) => {
		const data = messageEvent.data;
		setMessage(JSON.parse(data));
	}, []);
	useEffect(() => {
		ws.current = new WebSocket(wsApi);

		ws.current.onopen = () => {
			setWebSocket(ws.current);
			console.log('Connected to websocket');
		};

		ws.current.onmessage = handleMessage;

		ws.current.onclose = (e) => {
			if (e.code !== 1000) {
				// 1000 means normal closure
				console.log(
					'Socket is closed. Reconnect will be attempted.',
					e.reason
				);
				setTimeout(() => {
					setWebSocket(null);
					ws.current = new WebSocket(wsApi);
				}, 5000);
			}
		};

		ws.current.onerror = (err) => {
			console.error(
				'Socket encountered error: ',
				err.message,
				'Closing socket'
			);
			ws.current.close();
		};
		return () => {
			ws.current.close();
		};
	}, []);

	return (
		<WebSocketContext.Provider value={{ webSocket, message }}>
			{children}
		</WebSocketContext.Provider>
	);
};
