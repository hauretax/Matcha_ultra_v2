import React, { useState, ChangeEvent } from 'react'
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import apiProvider from '../services/apiProvider';
import { UserPublic } from '../../../comon_src/type/user.type';
import { prefixBackendUrl } from '../utils';
import InputFindUser from '../components/InputFindUser';

export default function FinderPage() {
    const [profiles, setprofiles] = useState<UserPublic[]>([])
    const [searchValues, setSearchValues] = useState({
        latitude: '',
        longitude: '',
        distanceMax: 500,
        ageMin: 18,
        ageMax: 50,
        orientation: [],
        interestWanted: []
    });

    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
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


    const searchUsers = () => {
        apiProvider.getUsers({
            latitude: 48.7932202,
            longitude: 3.27131,
            distanceMax: searchValues.distanceMax,
            ageMin: searchValues.ageMin,
            ageMax: searchValues.ageMax,
            orientation: ["Female", "Male"],
            interestWanted: ["video-game"]
        })
            .then((res: any) => {
                setprofiles(res.data)
            })
    }

    return (
        <>
            <InputFindUser
                handleSearchChange={handleSearchChange}
                searchUsers={searchUsers}
                handleAgeChange={handleAgeChange}
                ageMin = {searchValues.ageMin}
                ageMax = {searchValues.ageMax}
            />
            <ImageList sx={{ width: 500, height: 450 }}>
                {profiles.map((item) => (
                    <ImageListItem key={item.username}>
                        <img
                            src={prefixBackendUrl(item.pictures[0])}
                            srcSet={prefixBackendUrl(item.pictures[0])}
                            alt={"profile"}
                            loading="lazy"
                        />
                        <ImageListItemBar
                            title={item.username}
                            subtitle={<span> {item.age} : years</span>}
                            position="below"
                        />
                        <p>{item.distance} km</p>
                    </ImageListItem>
                ))}
            </ImageList>
        </>
    );
}
