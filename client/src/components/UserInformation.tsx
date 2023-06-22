import React, { useState } from 'react';
import { Box, TextField, Typography, Paper, Fab, CircularProgress, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Save, Edit } from '@mui/icons-material';

interface UserInformationProps {
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  orientation: string;
}

const UserInformation: React.FC<UserInformationProps> = (props) => {
  const [firstName, setFirstName] = useState(props.firstName);
  const [lastName, setLastName] = useState(props.lastName);
  const [age, setAge] = useState(props.age);
  const [gender, setGender] = useState(props.gender);
  const [orientation, setOrientation] = useState(props.orientation);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsEditing(false);
      setIsLoading(false);
      // Here you would persist the changes to the database
      // For example:
      // api.updateUserInfo({ firstName, lastName, age, gender, orientation }).then(() => setIsEditing(false));
    }, 2000);
  };

  return (
    <Box>
      <Typography component="h1" variant="h5" my={2}>
        User Information
      </Typography>
      <Paper elevation={5} sx={{ position: 'relative', minHeight: '250px', padding: '1rem' }}>
        <TextField
          fullWidth
          disabled={!isEditing}
          variant="outlined"
          label="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          sx={{ my: 1 }}
        />
        <TextField
          fullWidth
          disabled={!isEditing}
          variant="outlined"
          label="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          sx={{ my: 1 }}
        />
        <TextField
          fullWidth
          disabled={!isEditing}
          variant="outlined"
          label="Age"
          value={age}
          onChange={(e) => setAge(Number(e.target.value))}
          sx={{ my: 1 }}
        />
        <FormControl fullWidth disabled={!isEditing} variant="outlined" sx={{ my: 1 }}>
          <InputLabel id="gender-label">Gender</InputLabel>
          <Select
            labelId="gender-label"
            id="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value as string)}
            label="Gender"
          >
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth disabled={!isEditing} variant="outlined" sx={{ my: 1 }}>
          <InputLabel id="orientation-label">Sexual Orientation</InputLabel>
          <Select
            labelId="orientation-label"
            id="orientation"
            value={orientation}
            onChange={(e) => setOrientation(e.target.value as string)}
            label="Sexual Orientation"
          >
            <MenuItem value="Heterosexual">Heterosexual</MenuItem>
            <MenuItem value="Bisexual">Bisexual</MenuItem>
            <MenuItem value="Homosexual">Homosexual</MenuItem>
          </Select>
        </FormControl>
        <Fab
          color="primary"
          aria-label={isEditing ? 'save' : 'edit'}
          sx={{ position: 'absolute', bottom: 16, right: 16 }}
          onClick={isEditing ? handleSave : handleEdit}
          disabled={isLoading}>
          {isLoading ? (
            <CircularProgress size={24} />
          ) : isEditing ? (
            <Save />
          ) : (
            <Edit />
          )}
        </Fab>
      </Paper>
    </Box>
  );
};

export default UserInformation;
