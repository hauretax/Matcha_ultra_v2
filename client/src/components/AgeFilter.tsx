import React, { useState } from 'react'
import { Button, Popover, Slider, Typography } from '@mui/material';
import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material';

interface AgeFilterProps {
  ageRange: number[];
  setAgeRange: (ageRange: number[]) => void;
}

const AgeFilter: React.FC<AgeFilterProps> = ({ageRange, setAgeRange}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  //TODO: prevent age to go to 17 by pushing the Thumb 1
  const handleAgeChange = (
    event: Event,
    newValue: number | number[],
    activeThumb: number,
  ) => {
    const minDistance = 1
    if (!Array.isArray(newValue)) {
      return;
    }
    if (newValue[1] - newValue[0] < minDistance) {
      if (activeThumb === 0) {
        const clamped = Math.min(newValue[0], 100 - minDistance);
        setAgeRange([clamped, clamped + minDistance]);

      } else {
        const clamped = Math.max(newValue[1], minDistance);
        setAgeRange([clamped - minDistance, clamped]);
      }
    } else {
      setAgeRange(newValue as number[]);
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div>
      <Button aria-describedby={id} variant="contained" onClick={handleClick} endIcon={open ? <ArrowDropUp /> : <ArrowDropDown />}>
        Age
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
        <Typography sx={{p: 2}}>Entre {ageRange[0]} et {ageRange[1]} ans</Typography>
        <Slider
          value={ageRange}
          onChange={handleAgeChange}
          valueLabelDisplay="auto"
          disableSwap
          min={18}
          max={99}
          sx={{width: '200px', marginLeft: 2, marginRight: 2, marginBottom: 2}}
        />
      </Popover>
    </div>
  );
}

export default AgeFilter