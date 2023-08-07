import { useState } from 'react'

import { Button } from '@mui/material';

import { UserPublic } from '../../../comon_src/type/user.type';

import InputFindUser from '../components/InputFindUser';
import BrowsingResult from '../components/BrowsingResult';

export default function FinderPage() {
    const [profiles, setprofiles] = useState<UserPublic[]>([])
    const [end, setEnd] = useState(false)
    const [loading, setLoading] = useState(false)
    const [index, setIndex] = useState(0);
    const setupeProfile = (newProfile: UserPublic[]) => {
        setIndex(0)
        setLoading(false)
        setEnd(false)
        setprofiles(newProfile)
    }

    const addProfile = (newProfile: UserPublic[]) => {
        setprofiles((prevValues) => {
            const size = prevValues.length
            const newValue = [...prevValues, ...newProfile]
            if (size === newValue.length) {
                setEnd(true)
            }
            setLoading(false)
            return (newValue)
        })
    }

    const showMore = () => {
        if (end || loading) {
            return;
        }
        setLoading(true)
        setIndex((index) => index + 10)
    }

    //TODO: #6
    //TODO: Handle call failure
    return (
        <>
            <InputFindUser
                setupeProfile={setupeProfile}
                addProfile={addProfile}
                index={index}
            />

            <BrowsingResult users={profiles} handleLike={() => console.log('lol')}/>
            {
                (!end && !loading && profiles.length) &&
                <Button onClick={showMore} variant="contained">show More</Button>
            }
        </>
    );
}
