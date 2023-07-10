import React, { useState, useEffect } from 'react';
import { Box, TextField, Typography, Paper, Fab, CircularProgress, Chip, Autocomplete } from '@mui/material';
import { Save, Edit } from '@mui/icons-material';
import { useAuth } from '../context/AuthProvider';

interface InterestsProps {
  interests: string[];
  options: string[];
  updateDb:boolean;
  setOptions?: Function;
}

const Interests: React.FC<InterestsProps> = (props) => {
  const [interests, setInterests] = useState<string[]>(props.interests);
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const auth = useAuth()

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (props.setOptions) {
      console.log('qsd', interests)
      props.setOptions(interests)
    }
    setIsUploading(true);
    if(props.updateDb)
      await auth.updateInterests(interests)
    setIsEditing(false);
    setIsUploading(false);
  };

  const handleDelete = (chipToDelete: string) => {
    setInterests((chips) => chips.filter((chip) => chip !== chipToDelete));
  };

  const handleAddition = (event: any, newValue: string | null) => {
    console.log('qqqqqqq')
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
      <Paper elevation={5} sx={{ position: 'relative', minHeight: '125px', padding: '1rem' }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
          {interests.map((interest, index) => (
            <Chip
              key={index}
              label={`#${interest}`
              }
              onDelete={isEditing ? () => handleDelete(interest) : undefined}
              style={{ margin: '0.5rem' }}
            />
          ))}
          {isEditing ? (
            <Autocomplete
              freeSolo
              options={props.options}
              onChange={handleAddition}
              renderInput={(params) => (
                <TextField {...params} variant='standard' placeholder="Add Interest" size="small" sx={{ minWidth: '150px' }} />
              )}
            />
          ) : null}
        </Box>
        <Fab
          color="primary"
          aria-label={isEditing ? 'save' : 'edit'}
          sx={{ position: 'absolute', bottom: 16, right: 16 }}
          onClick={isEditing ? handleSave : handleEdit}
          disabled={isUploading}>
          {isUploading ? (
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

export default Interests;