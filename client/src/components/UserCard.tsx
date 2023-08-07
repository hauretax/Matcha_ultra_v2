import React, { useCallback } from "react";
import { Button, Card, CardActions, CardContent, CardMedia, Typography, Box } from "@mui/material";
import { LocationOn } from '@mui/icons-material';
import UserInterestsList from "./UserInterestList";
import { prefixBackendUrl } from "../utils";
import { useNavigate } from "react-router-dom";

interface UserCardProps {
  user: any;
  handleLike: (userId: number, liked: boolean) => void;
}

//TODO: improve image fitting proportion
const UserCard: React.FC<UserCardProps> = ({ user, handleLike }) => {
  const navigate = useNavigate()

  const navToProfile = useCallback(() => {
    navigate(`/profile/${user.userId}`)
  }, [user.userId, navigate])

  const updateLike = useCallback(() => {
    handleLike(user.userId, !user.liked)
  }, [handleLike, user.userId, user.liked])

  return (
    <Card>
      <CardMedia
        sx={{ height: 240 }}
        image={prefixBackendUrl(user.pictures[0])}
        title="Profile Picture"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {user.username}, {user.age}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'start' }}>
          <LocationOn sx={{ fontSize: '1rem', mr: 1, fontVariant: "body2", color: "text.secondary" }} />
          <Typography variant="body2" color="text.secondary">À {user.distance} km</Typography>
        </Box>
        <UserInterestsList interests={user.interests} />
      </CardContent>
      <CardActions>
        <Button onClick={navToProfile} size="small">View Profile</Button>
        <Button onClick={updateLike} size="small">{user.liked ? "Dislike" : "Like"}</Button>
      </CardActions>
    </Card>
  );
}

export default React.memo(UserCard);
