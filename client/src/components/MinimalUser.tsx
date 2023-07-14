import { ImageListItem, ImageListItemBar, Slider } from "@mui/material"
import { UserPublic } from "../../../comon_src/type/user.type"
import { prefixBackendUrl } from "../utils"

interface MUserProps {
    user: UserPublic
}

export default function MinimalUser(props: MUserProps) {
    const user = props.user
    const noteChange = (note: number, username: string) => {
        console.log(note, username)
    }

    return (
        <ImageListItem key={user.username} >
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
                    onChange={(event: any) => noteChange(event.target.value, user.username)}
                />
                <button></button>
            </div>
            <div>{user.gender}</div>
            <p>{user.distance} km</p>
            <div>{user.interests}</div>
        </ImageListItem>
    )
}