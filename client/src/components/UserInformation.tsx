import React, { useState } from 'react';
import { Box, TextField, Typography, Paper, FormControl, InputLabel, Select, MenuItem, Grid, Switch, FormControlLabel, SelectChangeEvent } from '@mui/material';
import { useAuth } from '../context/AuthProvider';
import EditButton from './EditButton';
import EditableFields from './EditableFields';
import MyTextField from './MyTextField';
import MySelectField from './MySelectField';

interface UserInformationProps {
  readOnly: boolean;
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: string;
  orientation: string;
  email?: string;
  customLocation?: boolean;
  longitude: string;
  latitude: string;
}

const UserInformation: React.FC<UserInformationProps> = (props) => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [birthDate, setBirthDate] = useState<string>('');
  const [gender, setGender] = useState<string>('');
  const [orientation, setOrientation] = useState<string>('');
  const [customLocation, setCustomLocation] = useState<boolean>(false);
  const [longitude, setLongitude] = useState<string>('');
  const [latitude, setLatitude] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const auth = useAuth();

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    setIsUploading(true);
    await auth.updateProfile(firstName, lastName, birthDate, gender, orientation, email, customLocation, latitude, longitude);
    setIsEditing(false);
    setIsUploading(false);
  };

  React.useEffect(() => {
    setEmail(props.email || '')
    setFirstName(props.firstName)
    setLastName(props.lastName)
    setBirthDate(props.birthDate)
    setGender(props.gender)
    setOrientation(props.orientation)
    setCustomLocation(props.customLocation || false)
    setLongitude(props.longitude)
    setLatitude(props.latitude)
  }, [props]);

  return (
    <Box>
      <Typography component="h1" variant="h5" my={2}>
        User Information
      </Typography>
      <Paper elevation={5} sx={{ position: 'relative', minHeight: '250px', padding: '1rem' }}>
        <Grid container spacing={2}>
          {!props.readOnly &&
            <Grid item xs={12}>
              <EditableFields isEditing={isEditing} value={email} label='Email' setState={setEmail}>
                <MyTextField />
              </EditableFields>
            </Grid>
          }
          <Grid item xs={12} sm={4}>
            <EditableFields isEditing={isEditing} value={firstName} label='Firstname' setState={setFirstName} >
              <MyTextField />
            </EditableFields>
          </Grid>
          <Grid item xs={12} sm={4}>
            <EditableFields isEditing={isEditing} value={lastName} label='Lastname' setState={setLastName} >
              <MyTextField />
            </EditableFields>
          </Grid>
          <Grid item xs={12} sm={4}>
            <EditableFields isEditing={isEditing} value={birthDate} label='Birthdate (YYYY-MM-DD)' setState={setBirthDate} >
              <MyTextField />
            </EditableFields>
          </Grid>
          <Grid item xs={12} sm={6}>
            <EditableFields isEditing={isEditing} value={gender} label='Gender' setState={setGender} options={['Male', 'Female', 'Other']} >
              <MySelectField />
            </EditableFields>
          </Grid>
          <Grid item xs={12} sm={6}>
            <EditableFields isEditing={isEditing} value={orientation} label='Sexual Orientation' setState={setOrientation} options={['Heterosexual', 'Bisexual', 'Homosexual']} >
              <MySelectField />
            </EditableFields>
          </Grid>
          {!props.readOnly && <Grid item xs={12}>
            <FormControlLabel
              control={<Switch
                checked={customLocation}
                onChange={() => setCustomLocation(!customLocation)}
                disabled={!isEditing}
              />}
              label="Custom Location"
            />
          </Grid>}
          {/* if customLocation is set to true, display input fields for longitude and latitude */}
          {(customLocation || props.readOnly) &&
            <>
              <Grid item xs={12} sm={6}>
                <EditableFields isEditing={isEditing} value={latitude} label='Latitude' setState={setLatitude} >
                  <MyTextField />
                </EditableFields>
              </Grid>
              <Grid item xs={12} sm={6}>
                <EditableFields isEditing={isEditing} value={longitude} label='Longitude' setState={setLongitude} >
                  <MyTextField />
                </EditableFields>
              </Grid>
            </>
          }
          {!props.readOnly && <EditButton isEditing={isEditing} onClick={() => isEditing ? handleSave() : handleEdit()} isUploading={isUploading} />}
        </Grid>
      </Paper>
    </Box>
  );
};

export default UserInformation;
