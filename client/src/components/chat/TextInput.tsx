import { Button, TextField } from '@mui/material';
import React, { useState } from 'react'
import apiProvider from '../../services/apiProvider';



export const TextInput = (props: {userTo:number, userFrom:number}) => {
	const [message, setMessage] = useState("");


    function sendMessage(event:React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        event.preventDefault();
        apiProvider.insertMessage({ message: message, idFrom: props.userFrom, idTo: props.userTo })
        // socket.emit('sendMessage', { message: message, idFrom: props.userFrom, idTo: props.userTo })
      }


	return (
		<>
			<TextField
				id="standard-text"
				label="un label"
				value={message}
				onChange={(event)=>setMessage(event.target.value)}
			/>
			<Button variant="contained" color="primary"  onClick={sendMessage}>
			</Button>
		</>
	);
};



