import React, { useState, useEffect } from 'react';
import { Box, TextField, Typography, Paper, Fab, CircularProgress } from '@mui/material';
import { Save, Edit } from '@mui/icons-material';
import { useAuth } from '../context/AuthProvider';

interface BiographyProps {
  biography: string;
  isLoading: boolean;
}

const Biography: React.FC<BiographyProps> = (props) => {
  const [biography, setBiography] = useState(props.biography || "");
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const auth = useAuth()
  console.log(props.biography, biography)

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    setIsUploading(true);
    await auth.updateBio(biography)
    setIsEditing(false);
    setIsUploading(false);
  };

  useEffect(() => {
    setBiography(props.biography || "");
  }, [props]);

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
            <Typography>
              {biography}
            </Typography>
          </Box>
        )}
        <Fab color="primary" aria-label={isEditing ? 'save' : 'edit'}
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

export default Biography;
