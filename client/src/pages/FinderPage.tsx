import { useRef, useState } from 'react'
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import { UserPublic } from '../../../comon_src/type/user.type';
import { prefixBackendUrl } from '../utils';
import InputFindUser from '../components/InputFindUser';
import { Button } from '@mui/material';

export default function FinderPage() {
    const [profiles, setprofiles] = useState<UserPublic[]>([])
    const [index, setIndex] = useState(0);
    const setupeProfile = (profile: any) => {
        setprofiles(profile)
    }
    return (
        <>
            <InputFindUser
                setupeProfile={setupeProfile}
                index={index}
            />
            <Button onClick={() => {
                setIndex((index) => index + 10);
            }} variant="contained">test</Button >

            <ImageList>
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
                        <div>{item.gender}</div>
                        <p>{item.distance} km</p>
                    </ImageListItem>
                ))}
            </ImageList>
        </>
    );
}
