import React, { useEffect, useState, createContext, useContext } from 'react';
import socketIOClient from 'socket.io-client';

import { useAuth } from './AuthProvider';

interface SocketContextType {
  connectedUsers: number[];
}

const SocketContext = createContext<SocketContextType>(null!);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [connectedUsers, setConnectedUsers] = useState<number[]>([]);
  const auth = useAuth();

  useEffect(() => {
    const socket = socketIOClient('http://localhost:8080');

    // Authenticate the user using the JWT token
    const authenticateSocket = () => {
      const accessToken = localStorage.getItem('accessToken');
      socket.emit('authenticate', { accessToken });
    };

    // Handle successful authentication
    const handleAuthenticated = (users: number[]) => {
      setConnectedUsers(users);
    };

    // Handle authentication failure
    const handleUnauthorized = (error: any) => {
      console.log('Socket authentication failed:', error.message);
      // Perform appropriate actions for unauthorized access
    };

    const handleMessage = ({ message, senderId  }:{ message: string, senderId: number}) => {
      alert(message + ' from ' + senderId)
    }

    // Socket connection and authentication
    authenticateSocket();

    socket.on('connectedUsers', handleAuthenticated);
    socket.on('unauthorized', handleUnauthorized);

    socket.on('newMessage', handleMessage)
    // Error handling
    socket.on('connect_error', (error) => {
      console.log('Socket connection error:', error.message);
      // Perform appropriate actions for connection error
    });

    socket.on('error', (error: Error) => {
      console.log('Socket error:', error.message);
      // Perform appropriate actions for socket error
    });

    // Clean up the socket connection
    return () => {
      setConnectedUsers([]);
      socket.disconnect();
    };
  }, [auth.user]);

  const value = { connectedUsers };
  console.log('tttt', value)
  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
}

function useSocket() {
  return useContext(SocketContext);
}

export default useSocket;