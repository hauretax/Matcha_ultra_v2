import React, { useState, useEffect } from "react";
import { Box, TextField, Typography, Paper, Chip, Autocomplete } from "@mui/material";
import { useAuth } from "../context/AuthProvider";
import EditButton from "./EditButton";
import { buildErrorString } from "../utils";
import { useSnackbar } from "../context/SnackBar";
import apiProvider from "../services/apiProvider";
import { ErrorResponse } from "../../../comon_src/type/error.type";

interface InterestsProps {
  interests: string[];
}

const Interests: React.FC<InterestsProps> = (props) => {
	const [interests, setInterests] = useState<string[]>(props.interests);
	const [isEditing, setIsEditing] = useState(false);
	const [isUploading, setIsUploading] = useState(false);
	const [options, setOptions] = useState<string[]>([]);
	const snackbar = useSnackbar();
	const auth = useAuth();


	useEffect(() => {
		const fetchOptions = async () => {
			try {
				const res = await apiProvider.getOptions();
				setOptions(res.data);
			} catch (err) {
				snackbar(buildErrorString(err as ErrorResponse, "Failed to fetch options"), "error");
			}
		};
		fetchOptions();
	}, [snackbar]);

	const handleEdit = () => {
		setIsEditing(true);
	};

	const handleSave = async () => {
		setIsUploading(true);
		await auth.updateInterests(interests);
		setIsEditing(false);
		setIsUploading(false);
	};

	const handleDelete = (chipToDelete: string) => {
		setInterests((chips) => chips.filter((chip) => chip !== chipToDelete));
	};

	const handleAddition = (event: React.SyntheticEvent<Element, Event>, newValue: string | null) => {
		if (newValue && !interests.includes(newValue)) {
			setInterests([...interests, newValue]);
		}
	};

	useEffect(() => {
		setInterests(props.interests);
	}, [props]);

	return (
		<Box>
			<Typography component="h1" variant="h5" my={2}>
        Interests
			</Typography>
			<Paper elevation={5} sx={{ position: "relative", minHeight: "125px", padding: "1rem" }}>
				<Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center" }}>
					{interests.map((interest, index) => (
						<Chip
							key={index}
							label={`#${interest}`
							}
							onDelete={isEditing ? () => handleDelete(interest) : undefined}
							style={{ margin: "0.5rem" }}
						/>
					))}
					{isEditing ? (
						<Autocomplete
							freeSolo
							options={options}
							onChange={handleAddition}
							renderInput={(params) => (
								<TextField {...params} variant='standard' placeholder="Add Interest" size="small" sx={{ minWidth: "150px" }} />
							)}
						/>
					) : null}
				</Box>
				<EditButton isEditing={isEditing} onClick={() => isEditing ? handleSave() : handleEdit()} isUploading={isUploading} />
			</Paper>
		</Box>
	);
};

export default Interests;