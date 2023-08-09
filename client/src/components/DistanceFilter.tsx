import React, { useRef, useState } from "react";
import { Box, Button, Popover, Slider, Typography } from "@mui/material";
import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";

interface DistanceFilterProps {
  distance: number;
  setDistance: (distance: number) => void;
}

const DistanceFilter: React.FC<DistanceFilterProps> = ({ distance, setDistance }) => {
	const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
	const buttonRef = useRef<HTMLButtonElement | null>(null);

	const handleAgeChange = (event: Event, newValue: number | number[]) => {
		if (Array.isArray(newValue)) return;
		setDistance(newValue);
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
        Distance
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
						style: { width: `${buttonRef?.current?.offsetWidth}px` },
					}
				}}
			>
				<Box sx={{ padding: 2 }}>
					<Typography>À moins de {distance} km</Typography>
					<Slider
						value={distance}
						onChange={handleAgeChange}
						valueLabelDisplay="auto"
						disableSwap
						min={1}
						max={200}
						sx={{ width: "100%", marginTop: 2 }}
					/>
				</Box>
			</Popover>
		</div>
	);
};

export default React.memo(DistanceFilter);