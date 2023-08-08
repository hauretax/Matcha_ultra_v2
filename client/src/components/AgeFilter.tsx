import React, { useState, useRef } from "react";
import { Box, Button, Popover, Slider, Typography } from "@mui/material";
import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";

interface AgeFilterProps {
  ageRange: number[];
  setAgeRange: (ageRange: number[]) => void;
}

const AgeFilter: React.FC<AgeFilterProps> = ({ ageRange, setAgeRange }) => {
	const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
	const buttonRef = useRef<HTMLButtonElement | null>(null);

	//TODO: prevent age to go to 17 by pushing the Thumb 1
	const handleAgeChange = (
		event: Event,
		newValue: number | number[],
		activeThumb: number,
	) => {
		const minDistance = 1;
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
	const id = open ? "simple-popover" : undefined;

	return (
		<div>
			<Button ref={buttonRef} fullWidth aria-describedby={id} variant="contained" onClick={handleClick} endIcon={open ? <ArrowDropUp /> : <ArrowDropDown />}>
        Age
			</Button>
			<Popover
				id={id}
				open={open}
				anchorEl={anchorEl}
				onClose={handleClose}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "left",
				}}
				transformOrigin={{
					vertical: "top",
					horizontal: "left"
				}}
				slotProps={{
					paper: {
						style: { width: `${buttonRef?.current?.offsetWidth}px` }, // here we set Popover's width
					}
				}}
			>
				<Box sx={{ padding: 2 }}>
					<Typography>Entre {ageRange[0]} et {ageRange[1]} ans</Typography>
					<Slider
						value={ageRange}
						onChange={handleAgeChange}
						valueLabelDisplay="auto"
						disableSwap
						min={18}
						max={99}
						sx={{ width: "100%", marginTop: 2}}
					/>
				</Box>
			</Popover>
		</div>
	);
};

export default React.memo(AgeFilter);