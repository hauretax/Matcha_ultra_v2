import React, { useState } from 'react';
import { Box, TextField, Typography, Paper, FormControl, InputLabel, Select, MenuItem, Grid } from '@mui/material';
import { useAuth } from '../context/AuthProvider';
import EditButton from './EditButton';

interface UserInformationProps {
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: string;
  orientation: string;
  email: string;
}

const UserInformation: React.FC<UserInformationProps> = (props) => {
  const [email, setEmail] = useState(props.email);
  const [firstName, setFirstName] = useState(props.firstName);
  const [lastName, setLastName] = useState(props.lastName);
  const [birthDate, setBirthDate] = useState(props.birthDate);
  const [gender, setGender] = useState(props.gender);
  const [orientation, setOrientation] = useState(props.orientation);
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const auth = useAuth();

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    setIsUploading(true);
    await auth.updateProfile(firstName, lastName, birthDate, gender, orientation, email);
    setIsEditing(false);
    setIsUploading(false);
  };

  React.useEffect(() => {
    setEmail(props.email || '')
    setFirstName(props.firstName || '')
    setLastName(props.lastName || '')
    setBirthDate(props.birthDate || '')
    setGender(props.gender || '')
    setOrientation(props.orientation || '')
  }, [props]);

  const handlDateChange = async (dateEl: any) => {
    const date = dateEl.target.value;

    if (date.length < birthDate.length) {
      if (date.length === 4 || date.length === 7) {
        setBirthDate(birthDate.slice(0, -2));
        return;
      }
      setBirthDate(date);
    }
    setBirthDate(date)
    if (date.length === 4 || date.length === 7)
      setBirthDate(date + "-")
  };

  return (
    <Box>
      <Typography component="h1" variant="h5" my={2}>
        User Information
      </Typography>
      <Paper elevation={5} sx={{ position: 'relative', minHeight: '250px', padding: '1rem' }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            {isEditing ?
              <TextField
                fullWidth
                disabled={!isEditing}
                variant="standard"
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ my: 1 }}
              /> :
              <Box sx={{ borderBottom: '1px solid gray', mt: '2px', mb: '8px' }}>
                <Typography variant='caption' color={'rgba(0,0,0,0.6)'}>Email</Typography>
                <Box>
                  <StyledTypo text={email} />
                </Box>
              </Box>
            }
          </Grid>
          <Grid item xs={12} sm={4}>
            {isEditing ?
              <TextField
                fullWidth
                disabled={!isEditing}
                variant="standard"
                label="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                sx={{ my: 1 }}
              /> :
              <Box sx={{ borderBottom: '1px solid gray', mt: '2px', mb: '8px' }}>
                <Typography variant='caption' color={'rgba(0,0,0,0.6)'}>First Name</Typography>
                <Box>
                  <StyledTypo text={firstName} />
                </Box>
              </Box>
            }
          </Grid>
          <Grid item xs={12} sm={4}>
            {isEditing ?
              <TextField
                fullWidth
                variant="standard"
                label="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                sx={{ my: 1 }}
              /> :
              <Box sx={{ borderBottom: '1px solid gray', mt: '2px', mb: '8px' }}>
                <Typography variant='caption' color={'rgba(0,0,0,0.6)'}>Last Name</Typography>
                <Box>
                  <StyledTypo text={lastName} />
                </Box>
              </Box>
            }
          </Grid>
          <Grid item xs={12} sm={4}>
            {isEditing ?
              <TextField
                fullWidth
                disabled={!isEditing}
                variant="standard"
                label="BirthDate (yyyy-mm-jj)"
                value={birthDate}
                onChange={(e) => handlDateChange(e)}
                sx={{ my: 1 }}
              /> :
              <Box sx={{ borderBottom: '1px solid gray', mt: '2px', mb: '8px' }}>
                <Typography variant='caption' color={'rgba(0,0,0,0.6)'}>BirthDate</Typography>
                <Box>
                  <StyledTypo text={birthDate} />
                </Box>
              </Box>
            }
          </Grid>
          <Grid item xs={12} sm={6}>
            {isEditing ?
              <FormControl fullWidth disabled={!isEditing} variant="standard" sx={{ my: 1 }}>
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
              </FormControl> :
              <Box sx={{ borderBottom: '1px solid gray', mt: '2px', mb: '8px' }}>
                <Typography variant='caption' color={'rgba(0,0,0,0.6)'}>Gender</Typography>
                <Box>
                  <StyledTypo text={gender} />
                </Box>
              </Box>
            }
          </Grid>
          <Grid item xs={12} sm={6}>
            {isEditing ?
              <FormControl fullWidth disabled={!isEditing} variant="standard" sx={{ my: 1 }}>
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
              </FormControl> :
              <Box sx={{ borderBottom: '1px solid gray', mt: '2px', mb: '8px' }}>
                <Typography variant='caption' color={'rgba(0,0,0,0.6)'}>Sexual Orientation</Typography>
                <Box>
                  <StyledTypo text={orientation} />
                </Box>
              </Box>
            }
          </Grid>
          <EditButton isEditing={isEditing} onClick={() => isEditing ? handleSave() : handleEdit()} isUploading={isUploading} />
        </Grid>
      </Paper>
    </Box>
  );
};

const StyledTypo = ({ text }: { text: (string | number) }) => (
  <Typography sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'elipsis', paddingBottom: '4px', paddingTop: '1px' }}><span>{text || "-"}</span></Typography>
)

export default UserInformation;
