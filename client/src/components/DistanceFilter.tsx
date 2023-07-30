import React, { useState } from 'react'
import { Button, Popover, Slider, Typography } from '@mui/material';
import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material';

interface DistanceFilterProps {
  distance: number;
  setDistance: (distance: number) => void;
}

const DistanceFilter: React.FC<DistanceFilterProps> = ({ distance, setDistance }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleAgeChange = (event: Event, newValue: number | number[]) => {
    if (Array.isArray(newValue)) return;
    setDistance(newValue)
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  console.log('re-render')

  return (
    <div>
      <Button aria-describedby={id} variant="contained" onClick={handleClick} endIcon={open ? <ArrowDropUp /> : <ArrowDropDown />}>
        Distance
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
      >
        <Typography sx={{ p: 2 }}>À moins de {distance} km</Typography>
        <Slider
          value={distance}
          onChange={handleAgeChange}
          valueLabelDisplay="auto"
          disableSwap
          min={1}
          max={200}
          sx={{ width: '200px', marginLeft: 2, marginRight: 2, marginBottom: 2 }}
        />
      </Popover>
    </div>
  );
}

export default React.memo(DistanceFilter)