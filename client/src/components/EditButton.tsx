import { Fab, CircularProgress } from "@mui/material";
import { Save, Edit } from "@mui/icons-material";

interface EditButtonProps {
  isEditing: boolean;
  isUploading: boolean;
  onClick: () => void;
}

const EditButton = ({ isEditing, isUploading, onClick }: EditButtonProps) => (
	<Fab 
		color="primary" 
		aria-label={isEditing ? "save" : "edit"}
		sx={{ position: "absolute", bottom: 16, right: 16 }}
		onClick={onClick}
		disabled={isUploading}
	>
		{isUploading ? (
			<CircularProgress size={24} />
		) : isEditing ? (
			<Save />
		) : (
			<Edit />
		)}
	</Fab>
);

export default EditButton;
