import React, { useState, useRef } from "react";
import { Box, Button, Popover, Slider, Typography } from "@mui/material";
import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";

interface Props {
  fameRange: number[];
  setFameRange: (fameRange: number[]) => void;
}

const FameFilter: React.FC<Props> = ({ fameRange, setFameRange }) => {
	const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
	const buttonRef = useRef<HTMLButtonElement | null>(null);

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
				setFameRange([clamped, clamped + minDistance]);

			} else {
				const clamped = Math.max(newValue[1], 18 + minDistance);
				setFameRange([clamped - minDistance, clamped]);
			}
		} else {
			setFameRange(newValue as number[]);
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
        Fame
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
					<Typography>{fameRange[0]} à {fameRange[1]} de popularité</Typography>
					<Slider
						value={fameRange}
						onChange={handleAgeChange}
						valueLabelDisplay="auto"
						disableSwap
						min={0}
						max={100}
						sx={{ width: "100%", marginTop: 2 }}
					/>
				</Box>
			</Popover>
		</div>
	);
};

export default React.memo(FameFilter);