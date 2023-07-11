import { Button, Checkbox, FormControlLabel, FormGroup, Slider } from "@mui/material";
import { useState, useEffect } from 'react'
import apiProvider from "../services/apiProvider";
import Interests from "./Interests";
import { useAuth } from "../context/AuthProvider";
function valuetext(value: number) {
    return `${value}`;
}

export default function InputFindUser(props: any) {
    const [searchValues, setSearchValues] = useState({
        latitude: '',
        longitude: '',
        distanceMax: 10,
        ageMin: 18,
        ageMax: 50,
    });
    const [orientation, updatedOrientation] = useState<string[]>([]);
    const [interestWanted, setinterestWanted] = useState<string[]>([])
    const [options, setOptions] = useState<string[]>([])


    useEffect(() => {
        apiProvider.getOptions()
            .then((res: any) => {
                setOptions(res.data)
            })
    }, [])


    /*TODO
    * latitde et longitude non pas d'interet (ils sont mit coter back) 
    * mais j'ai la flemme de fair un type qui les exclue
    */
    const searchUsers = () => {
        apiProvider.getUsers({
            latitude: 0,
            longitude: 0,
            distanceMax: searchValues.distanceMax,
            ageMin: searchValues.ageMin,
            ageMax: searchValues.ageMax,
            orientation: orientation,
            interestWanted: interestWanted
        })
            .then((res: any) => {
                props.setupeProfile(res.data)
            })
    }

    const changeOrentiation = (event: any) => {
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
    }

    const handleSearchChange = (event: any) => {
        const { name, value } = event.target;
        setSearchValues((prevValues) => ({
            ...prevValues,
            [name]: value
        }));
    };

    const handleChangeByName = (name: string, value: string | Array<String> | number) => {
        setSearchValues((prevValues) => ({
            ...prevValues,
            [name]: value
        }));
    }

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
                handleChangeByName('ageMin', clamped);
                handleChangeByName('ageMax', clamped + minDistance);
            } else {
                const clamped = Math.max(newValue[1], minDistance);
                handleChangeByName('ageMin', clamped - minDistance);
                handleChangeByName('ageMax', clamped);
            }
        } else {

            handleChangeByName('ageMin', newValue[0]);
            handleChangeByName('ageMax', newValue[1]);
        }
    };

    return (
        <>
            <Slider
                name="distanceMax"
                aria-label="distance"
                value={searchValues.distanceMax}
                getAriaValueText={valuetext}
                valueLabelDisplay="on"
                min={1}
                max={500}
                onChange={handleSearchChange}
            />
            <Slider
                value={[searchValues.ageMin, searchValues.ageMax]}
                onChange={handleAgeChange}
                valueLabelDisplay="on"
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
            <Interests setOptions={setinterestWanted} interests={interestWanted} options={options} updateDb={false} />

            <Button onClick={searchUsers} variant="contained">Search</Button>
        </>
    )
}