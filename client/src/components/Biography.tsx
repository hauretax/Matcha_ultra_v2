import React, { useState, useEffect } from 'react';
import { Box, TextField, Typography, Paper } from '@mui/material';
import { useAuth } from '../context/AuthProvider';
import EditButton from './EditButton';

interface BiographyProps {
  biography: string;
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
        <EditButton isEditing={isEditing} onClick={() => isEditing ? handleSave() : handleEdit()} isUploading={isUploading} />
      </Paper>
    </Box>
  );
};

export default Biography;
