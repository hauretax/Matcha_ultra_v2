import { Button, Checkbox, FormControlLabel, FormGroup, Slider } from "@mui/material";
import { useState, useEffect } from "react";
import apiProvider from "../services/apiProvider";
import { OrderBy } from "../../../comon_src/type/utils.type";
import { UserProfile } from "../../../comon_src/type/user.type";
function valuetext(value: number) {
	return `${value}`;
}

interface Props {
	index: number;
	setupeProfile: (profiles: UserProfile[]) => void;
	addProfile: (profiles: UserProfile[]) => void;
}

export default function InputFindUser(props: Props) {
	const [searchValues, setSearchValues] = useState({
		latitude: "",
		longitude: "",
		distanceMax: 10,
		ageMin: 18,
		ageMax: 50,
	});
	const [orientation, updatedOrientation] = useState<string[]>([]);
	const [orderBy, setOrderBy] = useState<OrderBy>("distance");
	useEffect(() => {
		if (props.index) {
			searchUsers(false);
		}
	}, [props.index]);

	//TODO #3

	const searchUsers = (newrequest?: boolean) => {
		apiProvider.getUsers({
			latitude: 0,
			longitude: 0,
			distanceMax: searchValues.distanceMax,
			ageMin: searchValues.ageMin,
			ageMax: searchValues.ageMax,
			orientation: orientation,
			interestWanted: [],
			index: newrequest ? 0 : props.index,
			orderBy: orderBy
		})
			.then((res: { data: UserProfile[] }) => {
				if (newrequest) {
					props.setupeProfile(res.data);
				} else
					props.addProfile(res.data);
			});
	};

	const changeOrentiation = (event: React.FormEvent) => {
		const { checked, value } = event.target as HTMLInputElement;
		updatedOrientation((prevOrientation) => {
			let updatedOrientation: string[];

			if (checked) {
				updatedOrientation = [...prevOrientation, value];
			} else {
				updatedOrientation = prevOrientation.filter((item) => item !== value);
			}
			return updatedOrientation;
		});
	};

	const handleSearchChange = (event: Event, value: number | number[]) => {
		setSearchValues((prevValues) => ({
			...prevValues,
			distanceMax: value as number
		}));
	};

	const handleChangeByName = (name: string, value: string | Array<string> | number) => {
		setSearchValues((prevValues) => ({
			...prevValues,
			[name]: value
		}));
	};

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
				handleChangeByName("ageMin", clamped);
				handleChangeByName("ageMax", clamped + minDistance);
			} else {
				const clamped = Math.max(newValue[1], minDistance);
				handleChangeByName("ageMin", clamped - minDistance);
				handleChangeByName("ageMax", clamped);
			}
		} else {

			handleChangeByName("ageMin", newValue[0]);
			handleChangeByName("ageMax", newValue[1]);
		}
	};

	return (
		<>
			<Slider
				name="distanceMax"
				aria-label="distance"
				value={searchValues.distanceMax}
				getAriaValueText={valuetext}
				valueLabelDisplay="auto"
				min={1}
				max={500}
				onChange={handleSearchChange}
			/>
			<Slider
				value={[searchValues.ageMin, searchValues.ageMax]}
				onChange={handleAgeChange}
				valueLabelDisplay="auto"
				getAriaValueText={valuetext}
				disableSwap
				min={18}
				max={99}
			/>
			<FormGroup
				aria-label="orientation"
				onChange={changeOrentiation}
				row
			>
				<FormControlLabel
					value="Female"
					control={<Checkbox />}
					label="Female"
					labelPlacement="top"
				/>
				<FormControlLabel
					value="Male"
					control={<Checkbox />}
					label="Male"
					labelPlacement="top"
				/>
				<FormControlLabel
					value="Other"
					control={<Checkbox />}
					label="Other"
					labelPlacement="top"
				/>
			</FormGroup>
			{/*TODO #7 */}
			<Button onClick={() => { searchUsers(true); setOrderBy("distance"); }} variant="contained">distance</Button>
			<Button onClick={() => { searchUsers(true); setOrderBy("age"); }} variant="contained">age</Button>
			<Button onClick={() => { searchUsers(true); setOrderBy("tag"); }} variant="contained">tag</Button>
			<Button onClick={() => alert("not implemented")/*{ searchUsers(true);setOrderBy("popularity")}*/} variant="contained">popularity</Button>
		</>
	);
}
