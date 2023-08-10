import React, { useState } from "react";
import { Box, Typography, Paper, Grid, Switch, FormControlLabel, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from "@mui/material";
import { useAuth } from "../context/AuthProvider";
import EditButton from "./EditButton";
import EditableFields from "./EditableFields";
import MyTextField from "./MyTextField";
import MySelectField from "./MySelectField";

interface UserInformationProps {
	firstName: string;
	lastName: string;
	birthDate: string;
	gender: string;
	preferences: string[];
	email: string;
	customLocation: boolean;
	longitude: string;
	latitude: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => { };

const UserInformation: React.FC<UserInformationProps> = (props) => {
	const [email, setEmail] = useState("");
	const [firstName, setFirstName] = useState<string>("");
	const [lastName, setLastName] = useState<string>("");
	const [birthDate, setBirthDate] = useState<string>("");
	const [gender, setGender] = useState<string>("");
	const [preferences, setPreferences] = useState<string[]>([]);
	const [customLocation, setCustomLocation] = useState<boolean>(false);
	const [longitude, setLongitude] = useState<string>("");
	const [latitude, setLatitude] = useState<string>("");
	const [isEditing, setIsEditing] = useState<boolean>(false);
	const [isUploading, setIsUploading] = useState<boolean>(false);
	const auth = useAuth();

	const handleEdit = () => {
		setIsEditing(true);
	};

	const handleSave = async () => {
		setIsUploading(true);
		await auth.updateProfile(firstName, lastName, birthDate, gender, preferences, email, customLocation, latitude, longitude);
		setIsEditing(false);
		setIsUploading(false);
	};

	React.useEffect(() => {
		setEmail(props.email || "");
		setFirstName(props.firstName);
		setLastName(props.lastName);
		setBirthDate(props.birthDate);
		setGender(props.gender);
		setPreferences(props.preferences);
		setCustomLocation(props.customLocation || false);
		setLongitude(props.longitude);
		setLatitude(props.latitude);
	}, [props]);

	const handlePreferencesChange = (event: SelectChangeEvent<string[]>) => {
		setPreferences(event.target.value as string[]);
	};

	return (
		<Box>
			<Typography component="h1" variant="h5" my={2}>
				User Information
			</Typography>
			<Paper elevation={5} sx={{ position: "relative", minHeight: "250px", padding: "1rem" }}>
				<Grid container spacing={2}>
					<Grid item xs={12}>
						<EditableFields isEditing={isEditing} value={email} label='Email' setState={setEmail}>
							<MyTextField label="" value="" setState={noop} />
						</EditableFields>
					</Grid>
					<Grid item xs={12} sm={4}>
						<EditableFields isEditing={isEditing} value={firstName} label='Firstname' setState={setFirstName} >
							<MyTextField label="" value="" setState={noop} />
						</EditableFields>
					</Grid>
					<Grid item xs={12} sm={4}>
						<EditableFields isEditing={isEditing} value={lastName} label='Lastname' setState={setLastName} >
							<MyTextField label="" value="" setState={noop} />
						</EditableFields>
					</Grid>
					<Grid item xs={12} sm={4}>
						<EditableFields isEditing={isEditing} value={birthDate} label='Birthdate (YYYY-MM-DD)' setState={setBirthDate} >
							<MyTextField label="" value="" setState={noop} />
						</EditableFields>
					</Grid>
					<Grid item xs={12} sm={6}>
						<EditableFields isEditing={isEditing} value={gender} label='Gender' setState={setGender} options={["Male", "Female", "Other"]} >
							<MySelectField label="" value="" setState={noop} isEditing={false} options={[]} />
						</EditableFields>
					</Grid>

					<Grid item xs={12} sm={6}>
						{isEditing ?
							<FormControl fullWidth disabled={!isEditing} variant="standard" sx={{ my: 1 }}>
								<InputLabel id={"preferences-label"}>Preferences</InputLabel>
								<Select
									labelId={"preferences-label"}
									id={"preferences"}
									multiple
									value={preferences}
									onChange={handlePreferencesChange}
									label='Preferences'
								>
									{["Male", "Female"].map((option, index) => <MenuItem key={index} value={option}>{option}</MenuItem>)}
								</Select>
							</FormControl> :
							<Box sx={{ borderBottom: "1px solid gray", mt: "2px", mb: "8px" }}>
								<Typography variant='caption' color={"rgba(0,0,0,0.6)"}>Preferences</Typography>
								<Box>
									<Typography sx={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "elipsis", paddingBottom: "4px", paddingTop: "1px" }}><span>{preferences.join(", ") || "-"}</span></Typography>
								</Box>
							</Box>
						}
					</Grid>
					<Grid item xs={12}>
						<FormControlLabel
							control={<Switch
								checked={customLocation}
								onChange={() => setCustomLocation(!customLocation)}
								disabled={!isEditing}
							/>}
							label="Custom Location"
						/>
					</Grid>
					{/* if customLocation is set to true, display input fields for longitude and latitude */}
					{customLocation &&
						<>
							<Grid item xs={12} sm={6}>
								<EditableFields isEditing={isEditing} value={latitude} label='Latitude' setState={setLatitude} >
									<MyTextField label="" value="" setState={noop} />
								</EditableFields>
							</Grid>
							<Grid item xs={12} sm={6}>
								<EditableFields isEditing={isEditing} value={longitude} label='Longitude' setState={setLongitude} >
									<MyTextField label="" value="" setState={noop} />
								</EditableFields>
							</Grid>
						</>
					}
					<EditButton isEditing={isEditing} onClick={() => isEditing ? handleSave() : handleEdit()} isUploading={isUploading} />
				</Grid>
			</Paper>
		</Box>
	);
};

export default UserInformation;
