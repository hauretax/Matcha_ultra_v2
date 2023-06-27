import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, Button, CircularProgress, Fab, IconButton, Skeleton, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Add, Delete, Edit, KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';

import { prefixBackendUrl } from '../utils';

function Carousel({ imgs, isLoading }: { imgs: string[], isLoading: boolean }) {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [uploading, setUploading] = useState<boolean>(false);
  const theme = useTheme();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Other functions here ...

  const handleFileInput = (event: any) => {
    const file = event.target.files[0];
    if (!file) return;
    if (activeIndex === imgs.length) {
      uploadImage(file);
    } else {
      editImage(file, imgs[activeIndex]);
    }
  };

  const handleClick = () => {
    if (fileInputRef.current)
      fileInputRef.current.click();
  };


  const changeImage = useCallback((nextIndex: number) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    setActiveIndex(nextIndex);

    intervalRef.current = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % imgs.length);
    }, 5000);
  }, [imgs.length]);

  useEffect(() => {
    changeImage(0);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [changeImage]);

  const goLeft = () => {
    changeImage((activeIndex + imgs.length) % imgs.length);
  };

  const goRight = () => {
    changeImage((activeIndex + 1) % (imgs.length + 1));
  };

  function deleteImage(arg0: string): void {
    console.log('Function not implemented.');
  }

  function editImage(arg0: string, id: string): void {
    console.log('Function not implemented.');
  }

  function uploadImage(arg0: string): void {
    console.log('Function not implemented.');
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      {isLoading ?
        <Skeleton variant="rectangular" height={300} /> :
        <>
          {activeIndex < imgs.length ?
            <Box sx={{ position: 'relative' }}>
              <Box
                component="img"
                sx={{
                  maxHeight: '300px',
                  display: 'block',
                  overflow: 'hidden',
                  width: '100%',
                  objectFit: 'contain',
                  backgroundColor: '#fff'
                }}
                src={prefixBackendUrl(imgs[activeIndex])}
                alt={'picture'}
              />
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
                onClick={() => deleteImage(imgs[activeIndex])}
                disabled={uploading}>
                {uploading ?
                  <CircularProgress size={24} /> :
                  <Delete />
                }
              </Fab>
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
            <Button onClick={goLeft} disabled={activeIndex === 0}>
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
            </Box>
            <Button onClick={goRight} disabled={activeIndex === imgs.length}>
              Next
              {theme.direction === 'rtl' ? (
                <KeyboardArrowLeft />
              ) : (
                <KeyboardArrowRight />
              )}
            </Button>
          </Box>
        </>
      }
    </Box >
  );
}

export default Carousel;
