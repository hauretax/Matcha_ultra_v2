import { Card, CardContent, Typography } from "@mui/material";

const ProfileCard: React.FC<any> = ({ user }) => {
    return (
      <Card>
        {/* <CardMedia
          sx={{ height: 240 }}
          image={prefixBackendUrl(user.pictures[0])}
          title="Profile Picture"
        /> */}
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {user.username}
          </Typography>
        </CardContent>
      </Card>
    );
  }

  export default ProfileCard