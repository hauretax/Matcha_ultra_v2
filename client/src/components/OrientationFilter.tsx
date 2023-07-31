import React, { useState } from 'react'
import { Button, Popper, Autocomplete, TextField, ClickAwayListener, Checkbox } from '@mui/material';
import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material';

import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

interface OrientationFilterProps {
  orientation: ("Female" | "Male" | "Other")[];
  setOrientation: (orientation: ("Female" | "Male" | "Other")[]) => void;
}

const OrientationFilter: React.FC<OrientationFilterProps> = ({ orientation, setOrientation }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleChange = (event: any, value: string[]) => {
    event.stopPropagation()
    const filteredValue: ("Female" | "Male" | "Other")[] = value.filter((val) => val === "Female" || val === "Male" || val === "Other") as ("Female" | "Male" | "Other")[]
    setOrientation(filteredValue)
    console.log(value)
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(prev => prev === event.currentTarget ? null : event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <div>
      <Button variant="contained" onClick={handleClick} endIcon={open ? <ArrowDropUp /> : <ArrowDropDown />}>
        Orientation
      </Button>
      <Popper open={open} anchorEl={anchorEl} placement="bottom-start" disablePortal sx={{ width: '250px' }}>
        <ClickAwayListener onClickAway={handleClose}>
          <Autocomplete
            multiple
            open={open}
            value={orientation}
            onChange={handleChange}
            options={['Female', 'Male', 'Other']}
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Checkbox
                  icon={icon}
                  checkedIcon={checkedIcon}
                  style={{ marginRight: 8 }}
                  checked={selected}
                />
                {option}
              </li>
            )}
            sx={{ bgcolor: '#ffff' }}
            popupIcon={null}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                sx={{ paddingTop: 1 }}
                InputProps={{
                  ...params.InputProps,
                  sx: {
                    '.MuiChip-root': {
                      marginBottom: 1, // add margin under the chips
                    },
                  },
                }}
              />
            )}
          />
        </ClickAwayListener>
      </Popper>
    </div>
  );
}

export default React.memo(OrientationFilter)
