import { Button, TextField } from "@mui/material";
import React, { useState } from "react";
import apiProvider from "../../services/apiProvider";
import { useAuth } from "../../context/AuthProvider";
import { ErrorResponse } from "../../../../comon_src/type/error.type";


export const TextInput = (props: { userTo: number, userFrom: number }) => {
	const [message, setMessage] = useState("");

	const auth = useAuth();
	async function handleClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
		event.preventDefault();
		try {
			console.log("helo");
			await apiProvider.insertMessage({ message: message, idFrom: props.userFrom, idTo: props.userTo });
		} catch (error) {
			console.log("test");
			auth.handleError(error as ErrorResponse, "Message not send");
		}
	}

	return (
		<>
			<TextField
				id="standard-text"
				label="un label"
				value={message}
				onChange={(event) => setMessage(event.target.value)}
			/>
			<Button variant="contained" color="primary" onClick={handleClick}>
			</Button>
		</>
	);
};



