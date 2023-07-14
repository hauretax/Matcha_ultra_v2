import { Button, ImageListItem, ImageListItemBar, Slider } from "@mui/material"
import { UserPublic } from "../../../comon_src/type/user.type"
import { prefixBackendUrl } from "../utils"
import { useState } from "react"
import apiProvider from "../services/apiProvider"

interface MUserProps {
    user: UserPublic
}
//TODO #8

export default function MinimalUser(props: MUserProps) {
    const user = props.user
    const [note, setnote] = useState(0)
    const [isActive, setActive] = useState(false)
    const noteChange = () => {
        console.log(note, user.username)
        apiProvider.noteUsers({
            note:note,
            userTo:user.username
        })
    }

    return (
        <ImageListItem key={user.username}>
            <img
                src={prefixBackendUrl(user.pictures[0])}
                srcSet={prefixBackendUrl(user.pictures[0])}
                alt={"profile"}
                loading="lazy"
            />
            <ImageListItemBar
                title={user.username}
                subtitle={<span> {user.age} : years</span>}
                position="below"
            />
            <div>
                <Slider
                    sx={{ justifyContent: 'center', width: '75%' }}
                    name="note"
                    valueLabelDisplay="auto"
                    min={0}
                    max={10}
                    value={note}
                    onChange={(event: any) => { setnote(event.target.value); setActive(true) }}
                />
                {
                    isActive && (
                        <Button onClick={() => { noteChange(); setActive(false) }} variant="contained">save</Button>
                    )
                }
            </div>
            <div>{user.gender}</div>
            <p>{user.distance} km</p>
            <div>{user.interests}</div>
        </ImageListItem>
    )
}