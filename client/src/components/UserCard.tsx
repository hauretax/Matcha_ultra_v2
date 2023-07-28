import React from "react";
import { Button, Card, CardActions, CardContent, CardMedia, Typography, Box } from "@mui/material";
import { LocationOn } from '@mui/icons-material';
import UserInterestsList from "./UserInterestList";
import { prefixBackendUrl } from "../utils";

interface UserCardProps {
  user: any;
}

const UserCard: React.FC<UserCardProps> = ({ user }) => {
  user.liked = false;
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        sx={{ height: 140 }}
        image={prefixBackendUrl(user.pictures[0])}
        title="Profile Picture"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {user.username}, {user.age}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <Box sx={{ display: 'flex', alignItems: 'stretch' }}>
            <LocationOn sx={{fontSize: '1rem', mr: 1}} />
            <span>À {user.distance} km</span>
          </Box>
        </Typography>
        <UserInterestsList interests={user.interests} />
      </CardContent>
      <CardActions>
        <Button size="small">View Profile</Button>
        <Button size="small">{user.liked ? "Dislike" : "Like"}</Button>
      </CardActions>
    </Card>
  );
}

export default UserCard;