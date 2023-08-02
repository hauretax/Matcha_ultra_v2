import React, { useState, useRef } from 'react';
import { Box, Button, CircularProgress, Fab, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Add, Delete, Edit, KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';

import { prefixBackendUrl } from '../utils';
import { useAuth } from '../context/AuthProvider';

interface CarouselProps {
  readOnly: boolean;
  imgs: { id: number; src: string }[];
}

const Carousel: React.FC<CarouselProps> = ({ readOnly, imgs }) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [uploading, setUploading] = useState<boolean>(false);
  const theme = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const auth = useAuth();

  // Other functions here ...

  const handleFileInput = (event: any) => {

    const file = event.target.files[0];
    if (!file) return;
    if (activeIndex === imgs.length) {
      uploadImage(file);
    } else {
      editImage(file, imgs[activeIndex].id);
    }
  };

  const handleClick = () => {
    if (fileInputRef.current)
      fileInputRef.current.click();
  };


  const changeImage = (nextIndex: number) => {
    setActiveIndex(nextIndex);
  };

  const goLeft = () => {
    changeImage((activeIndex + imgs.length) % (imgs.length + (readOnly ? 0 : 1)));
  };

  const goRight = () => {
    changeImage((activeIndex + 1) % (imgs.length + (readOnly ? 0 : 1)));
  };

  async function deleteImage(pictureId: number): Promise<void> {
    setUploading(true);
    await auth.deletePicture(pictureId)
    setUploading(false);
  }

  async function editImage(file: File, pictureId: number): Promise<void> {
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    await auth.updatePicture(formData, pictureId)
    setUploading(false);
  }

  async function uploadImage(file: File): Promise<void> {
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    await auth.insertPicture(formData)
    setUploading(false);
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      {activeIndex < imgs.length ?
        <Box sx={{ position: 'relative' }}>
          <Box
            component="img"
            sx={{
              height: '300px',
              display: 'block',
              overflow: 'hidden',
              width: '100%',
              objectFit: 'contain',
              backgroundColor: '#fff'
            }}
            src={prefixBackendUrl(imgs[activeIndex].src)}
            alt={'Issue while fetching picture'}
          />
          {!readOnly &&
            <Box>
              <Fab
                color="primary"
                aria-label={'edit'}
                sx={{ position: 'absolute', bottom: 16, right: 84 }}
                onClick={handleClick}
                disabled={uploading}>
                {uploading ?
                  <CircularProgress size={24} /> :
                  <Edit />
                }
              </Fab>
              <Fab
                color="primary"
                aria-label={'delete'}
                sx={{ position: 'absolute', bottom: 16, right: 16 }}
                onClick={() => deleteImage(imgs[activeIndex].id)}
                disabled={uploading}>
                {uploading ?
                  <CircularProgress size={24} /> :
                  <Delete />
                }
              </Fab>
            </Box>
          }

        </Box> :
        <Box sx={{ height: '300px', backgroundColor: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
          <Fab color="primary" aria-label="add" disabled={uploading} onClick={handleClick}>
            <Add />
          </Fab>
          <Typography
            sx={{
              marginTop: '10px',
              textAlign: 'center'
            }}
          >
            Click here to add a picture
          </Typography>
        </Box>
      }
      <input
        ref={fileInputRef}
        type="file"
        hidden
        onChange={handleFileInput}
        accept="image/*"
      />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button onClick={goLeft}>
          {theme.direction === 'rtl' ? (
            <KeyboardArrowRight />
          ) : (
            <KeyboardArrowLeft />
          )}
          Back
        </Button>
        <Box sx={{ display: 'flex', justifyContent: 'center', margin: '10px 0' }}>
          {imgs.map((_img, index) => (
            <span
              key={index}
              style={{
                height: '10px',
                width: '10px',
                margin: '0 5px',
                backgroundColor: index === activeIndex ? 'black' : 'gray',
                borderRadius: '50%',
                display: 'inline-block'
              }}
            />
          ))}
          {!readOnly &&
            <span
              key={imgs.length}
              style={{
                height: '10px',
                width: '10px',
                margin: '0 5px',
                backgroundColor: imgs.length === activeIndex ? 'black' : 'gray',
                borderRadius: '50%',
                display: 'inline-block'
              }}
            />
          }
        </Box>
        <Button onClick={goRight}>
          Next
          {theme.direction === 'rtl' ? (
            <KeyboardArrowLeft />
          ) : (
            <KeyboardArrowRight />
          )}
        </Button>
      </Box>
    </Box >
  );
}

export default Carousel;
