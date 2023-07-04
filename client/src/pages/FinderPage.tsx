import React, { useEffect, useState } from 'react'
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import apiProvider from '../services/apiProvider';
import { UserProfile } from '../../../comon_src/type/user.type';

export default function FinderPage() {
    const [profiles, setprofiles] = useState<UserProfile[]>([])

    useEffect(() => {
        apiProvider.getOptions()
            .then((res: any) => {
                setprofiles(res.data)
            })
    }, [])

    return (
        <ImageList sx={{ width: 500, height: 450 }}>
            {profiles.map((item) => (
                <ImageListItem key={item.pictures[0].src}>
                    <img
                        src={`${item.pictures[0].src}?w=248&fit=crop&auto=format`}
                        srcSet={`${item.pictures[0].src}?w=248&fit=crop&auto=format&dpr=2 2x`}
                        alt={"profile"}
                        loading="lazy"
                    />
                    <ImageListItemBar
                        title={item.username}
                        subtitle={<span>by: {item.birthDate}</span>}
                        position="below"
                    />
                </ImageListItem>
            ))}
        </ImageList>
    );
}
