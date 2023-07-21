import React, { useEffect, useState } from 'react';
import { WebSocketContext } from './WebSocketContext';

export const WebSocketProvider = ({ children }) => {
	const [webSocket, setWebSocket] = useState(null);

	useEffect(() => {
		const ws = new WebSocket('ws://your-websocket-endpoint');
		setWebSocket(ws);
		return () => {
			ws.close();
		};
	}, []);

	return (
		<WebSocketContext.Provider value={webSocket}>
			{children}
		</WebSocketContext.Provider>
	);
};
