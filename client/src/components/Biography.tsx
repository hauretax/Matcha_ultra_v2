import React, { useState } from 'react';
import { Box, TextField, Typography, Paper, Fab, CircularProgress } from '@mui/material';
import { Save, Edit } from '@mui/icons-material';

interface BiographyProps {
  biography: string;
}

const Biography: React.FC<BiographyProps> = (props) => {
  const [biography, setBiography] = useState(props.biography);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsLoading(true);
    // Mimicking API call delay with setTimeout
    setTimeout(() => {
      setIsEditing(false);
      setIsLoading(false);
      // Here you can make an API call or whatever is necessary to save the changes
      // For example:
      // api.updateBiography(biography).then(() => {
      //   setIsEditing(false);
      //   setIsLoading(false);
      // });
    }, 1000);
  };

  return (

    <Box>
      <Typography component="h1" variant="h5" my={2}>
        Biography
      </Typography>
      <Paper elevation={5} sx={{ position: 'relative', minHeight: '125px' }}>
        {isEditing ? (
          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={biography}
            onChange={(e) => setBiography(e.target.value)}
          />
        ) : (
          <Box p={2}>
            {biography}
          </Box>
        )}
        <Fab color="primary" aria-label={isEditing ? 'save' : 'edit'}
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

export default Biography;
