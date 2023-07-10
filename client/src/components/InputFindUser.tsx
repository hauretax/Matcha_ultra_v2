import { Button, Checkbox, FormControlLabel, Slider } from "@mui/material";

function valuetext(value: number) {
    return `${value}`;
}

export default function InputFindUser(props: any) {

    return (
        <>
            <Slider
                name="distanceMax"
                aria-label="distance"
                defaultValue={2}
                getAriaValueText={valuetext}
                valueLabelDisplay="on"
                min={1}
                max={500}
                onChange={props.handleSearchChange}
            />
            <Slider
                value={[props.ageMin, props.ageMax]}
                onChange={props.handleAgeChange}
                valueLabelDisplay="on"
                getAriaValueText={valuetext}
                disableSwap
                min={18}
                max={99}
            />
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
            <Button onClick={props.searchUsers} variant="contained">Search</Button>
        </>
    )
}