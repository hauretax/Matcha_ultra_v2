import { Button, TextField } from "@mui/material";
import React, { useState } from "react";
import apiProvider from "../../services/apiProvider";
import { ErrorResponse } from "../../../../comon_src/type/error.type";
import { buildErrorString } from "../../utils";
import { useSnackbar } from "../../context/SnackBar";


export const TextInput = (props: { userTo: number, userFrom: number }) => {
	const [message, setMessage] = useState("");

	const snackbar = useSnackbar();
	async function handleClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
		event.preventDefault();
		try {
			await apiProvider.insertMessage({ message: message, idFrom: props.userFrom, idTo: props.userTo });
		} catch (error) {
			snackbar(buildErrorString(error as ErrorResponse, "Message not send"), "error");
		
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



