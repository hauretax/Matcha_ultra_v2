import { Button, Checkbox, Popover } from "@mui/material";
import { ArrowDropDown, ArrowDropUp, CheckBoxOutlineBlank, CheckBox } from "@mui/icons-material";
import React, { useRef, useState } from "react";
import styled from "styled-components";

const icon = <CheckBoxOutlineBlank fontSize="small" />;
const checkedIcon = <CheckBox fontSize="small" />;

interface OrderByFilterProps {
  orderBy: "distance" | "age" | "tag" | "popularity";
  setOrderBy: (orderBy: "distance" | "age" | "tag" | "popularity") => void;
}

const LiOption = styled.li`
  padding: 6px 16px;
  transition: background-color 0.2s ease;
  cursor: pointer;

  &:hover {
    background-color: #f5f5f5; /* change to your preferred color */
  }

  &.selected {
    background-color: rgba(255, 110, 110, 0.08);
  }
`;

const OrderByFilter: React.FC<OrderByFilterProps> = ({ orderBy, setOrderBy }) => {
	const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
	const buttonRef = useRef<HTMLButtonElement | null>(null);

	const handleChange = (value: "distance" | "age" | "tag" | "popularity") => {
		setOrderBy(value);
	};

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const open = Boolean(anchorEl);

	const option = (label: string) => (
		<LiOption key={label} className={orderBy === label ? "selected" : "normal"} onClick={() => handleChange(label as "distance" | "age" | "tag" | "popularity")}>
			<Checkbox
				icon={icon}
				checkedIcon={checkedIcon}
				style={{ marginRight: 8 }}
				checked={orderBy === label}
			/>
			{label}
		</LiOption>
	);

	return (
		<div>
			<Button ref={buttonRef} fullWidth variant="contained" onClick={handleClick} endIcon={open ? <ArrowDropUp /> : <ArrowDropDown />}>
        Order by
			</Button>
			<Popover
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
				<ul style={{ "listStyle": "none", "padding": 0 }}>
					{["distance", "age", "tag", "popularity"].map(option)}
				</ul>
			</Popover>
		</div>
	);
};

export default OrderByFilter;