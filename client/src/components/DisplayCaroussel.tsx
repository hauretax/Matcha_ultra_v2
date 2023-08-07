import { Box, Fab } from '@mui/material';
import React, { useState } from 'react'
import { prefixBackendUrl } from '../utils';
import { ArrowLeft, ArrowRight } from '@mui/icons-material';

interface Props {
  imgs: { id: number; src: string }[];
}

const DisplayCaroussel: React.FC<Props> = ({ imgs }) => {
  const [activeIndex, setActiveIndex] = useState<number>(0)

  const handleLeft = () => {
    setActiveIndex((activeIndex + imgs.length + 1) % imgs.length)
  }

  const handleRight = () => {
    setActiveIndex((activeIndex + 1) % imgs.length)
  }

  return (
    <Box sx={{ position: 'relative' }}>
      <Box
        component="img"
        sx={{
          height: '300px',
          width: '100%',
          display: 'block',
          overflow: 'hidden',
          objectFit: 'contain',
          backgroundColor: 'white'
        }}
        src={prefixBackendUrl(imgs[activeIndex].src)}
        alt={'Issue while fetching picture'}
      />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Fab
          color="primary"
          onClick={handleLeft}
          sx={{ position: 'absolute', left: 10, top: 122 }}
        >
          <ArrowLeft />
        </Fab>
        <Fab
          color="primary"
          onClick={handleRight}
          sx={{ position: 'absolute', right: 10, top: 122 }}
        >
          <ArrowRight />
        </Fab>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'absolute', width: '100%', bottom: '5px' }}>
        {imgs.map((_img, index) => (
          <span
            key={index}
            style={{
              height: index === activeIndex ? '15px' : '10px',
              width: index === activeIndex ? '15px' : '10px',
              margin: '0 5px',
              backgroundColor: index === activeIndex ? 'white' : 'gray',
              borderRadius: '50%',
              display: 'inline-block',
              border: index === activeIndex ? '1px solid black' : '0'
            }}
          />
        ))}
      </Box>
    </Box>
  )
}

export default DisplayCaroussel