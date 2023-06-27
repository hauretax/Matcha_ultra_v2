import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, Button, Skeleton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';

import { prefixBackendUrl } from '../utils';

function Carousel({ imgs, isLoading }: { imgs: string[], isLoading: boolean }) {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const theme = useTheme();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);


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
    changeImage((activeIndex + imgs.length - 1) % imgs.length);
  };

  const goRight = () => {
    changeImage((activeIndex + 1) % imgs.length);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {isLoading ?
        <Skeleton variant="rectangular" height={300} /> :
        <>
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
            </Box>
            <Button onClick={goRight} disabled={activeIndex === imgs.length - 1}>
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
    </Box>
  );
}

export default Carousel;
