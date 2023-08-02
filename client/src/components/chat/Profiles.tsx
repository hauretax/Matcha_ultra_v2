import { Grid } from "@mui/material";
import UserCard from "../UserCard";
import ProfileCard from "./ProfileCarde";

function BrowsingChatProfiles(props: { profiles: { username: string, userId: number }[] }) {
    return (
        <Grid container spacing={2} >
            {props.profiles.map((profile) => (
                <Grid item xs={12} key={profile.userId}>
                    <ProfileCard user={profile.username} />
                </Grid>
            ))}
        </Grid>
    )
}

export default BrowsingChatProfiles