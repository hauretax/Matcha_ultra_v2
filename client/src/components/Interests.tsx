import React, { useState, useEffect } from 'react';
import { Box, TextField, Typography, Paper, Chip, Autocomplete } from '@mui/material';
import { useAuth } from '../context/AuthProvider';
import EditButton from './EditButton';

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
        <EditButton isEditing={isEditing} onClick={() => isEditing ? handleSave() : handleEdit()} isUploading={isUploading} />
      </Paper>
    </Box>
  );
};

export default Interests;