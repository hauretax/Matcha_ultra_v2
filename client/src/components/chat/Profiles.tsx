import { Grid } from "@mui/material";
import ProfileCard from "./ProfileCarde";
import { Profile } from "../../../../comon_src/type/utils.type";

function BrowsingChatProfiles(props: { profiles: Profile[], handleClickProfile: (id: number) => void }) {
    return (
        <Grid container spacing={2}  >
            {props.profiles &&
                props.profiles.map((profile) => (
                    <Grid item xs={12} key={profile.id} onClick={() => props.handleClickProfile(profile.id)}>
                        <ProfileCard user={profile} />

                    </Grid>
                ))}
        </Grid>
    )
}

export default BrowsingChatProfiles