import { Box, Typography } from "@mui/material";
import React from "react";

interface EditableFieldsProps {
  isEditing: boolean;
  children: React.ReactElement;
  label: string;
  value: string | number;
  setState: React.Dispatch<React.SetStateAction<string>>;
  options?: string[];
}

const EditableFields: React.FC<EditableFieldsProps> = ({ isEditing, children, label, value, setState, options }) => {

	return (
		<>
			{isEditing ?
				React.cloneElement(children, { label, value, setState, isEditing, options }) :
				<Box sx={{ borderBottom: "1px solid gray", mt: "2px", mb: "8px" }}>
					<Typography variant='caption' color={"rgba(0,0,0,0.6)"}>{label}</Typography>
					<Box>
						<Typography sx={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "elipsis", paddingBottom: "4px", paddingTop: "1px" }}><span>{value || "-"}</span></Typography>
					</Box>
				</Box>
			}
		</>
	);
};

export default EditableFields;