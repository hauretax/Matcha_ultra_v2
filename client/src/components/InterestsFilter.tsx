import React, { useRef, useState } from "react";
import { Button, Popper, Autocomplete, TextField, ClickAwayListener, Checkbox } from "@mui/material";
import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";

import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

interface InterestsFilterProps {
  options: string[];
  interests: string[];
  setInterests: (interests: string[]) => void;
}

const InterestsFilter: React.FC<InterestsFilterProps> = ({ options, interests, setInterests }) => {
	const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
	const buttonRef = useRef<HTMLButtonElement | null>(null);
  
	const handleChange = (event: React.SyntheticEvent, value: string[]) => {
		event.stopPropagation();
		setInterests(value);
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
			<Button ref={buttonRef} fullWidth variant="contained" onClick={handleClick} endIcon={open ? <ArrowDropUp /> : <ArrowDropDown />}>
        interests
			</Button>
			<Popper open={open} anchorEl={anchorEl} placement="bottom-start" disablePortal sx={{ width: `${buttonRef?.current?.offsetWidth}px`, zIndex: 1301 }}>
				<ClickAwayListener onClickAway={handleClose}>
					<Autocomplete
						multiple
						open={open}
						value={interests}
						onChange={handleChange}
						options={options}
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
						sx={{ bgcolor: "#ffff" }}
						popupIcon={null}
						renderInput={(params) => (
							<TextField
								{...params}
								variant="standard"
								sx={{ paddingTop: 1 }}
								InputProps={{
									...params.InputProps,
									sx: {
										".MuiChip-root": {
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
};

export default React.memo(InterestsFilter);
