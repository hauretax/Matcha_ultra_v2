import React from "react";
import { SelectChangeEvent, FormControl, InputLabel, Select, MenuItem } from "@mui/material";

interface MySelectFieldProps {
  label: string;
  value: string;
  setState: React.Dispatch<React.SetStateAction<string>>;
  isEditing: boolean;
  options: string[];
}

const MySelectField: React.FC<MySelectFieldProps> = ({ label, value, setState, isEditing , options}) => {
	const handleChange = (e: SelectChangeEvent<string>) => {
		setState(e.target.value);
	};

	const shortLabel = label.split(" ").pop()?.toLowerCase() || "";

	return (
		<FormControl fullWidth disabled={!isEditing} variant="standard" sx={{ my: 1 }}>
			<InputLabel id={`${shortLabel}-label`}>{label}</InputLabel>
			<Select
				labelId={`${shortLabel}-label`}
				id={shortLabel}
				value={value}
				onChange={handleChange}
				label={label}
			>
				{options.map((option, index) => <MenuItem key={index} value={option}>{option}</MenuItem>)}
			</Select>
		</FormControl>
	);
};

export default MySelectField;