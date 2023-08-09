import React from "react";
import DisplayCaroussel from "./DisplayCaroussel";
import { Box, Button, Typography } from "@mui/material";
import { LocationOn, Circle, FavoriteBorder, EmojiEvents, Recommend, NotInterested, Flag } from "@mui/icons-material";
import UserInterestsList from "./UserInterestList";

interface Props {
  id: number;
  username: string;
  lastName: string;
  firstName: string;
  gender: string;
  orientation: string;
  pictures: { id: number; src: string }[];
  interests: string[];
  biography: string;
  distance: number;
  age: number;
  connected: boolean;
  lastTime: string;
  linkStatus: string;
  fameRating: number;
  liked: boolean;
  blocked: boolean;
  reported: boolean;
  like: () => void;
  block: () => void;
  report: () => void;
}

const Profile: React.FC<Props> = (props) => {

	return (
		<Box>
			<DisplayCaroussel imgs={props.pictures} />
			<Box sx={{ backgroundColor: "white", marginTop: 2, p: 2 }}>
				<Box sx={{ mb: 2 }}>
					<Typography variant="h5" component="div">
						{props.username}, {props.age}
					</Typography>
					<Typography variant="body2" component="div">
						{props.firstName} {props.lastName}, {props.gender}, {props.orientation}
					</Typography>
				</Box>
				<Box sx={{ mb: 2 }}>
					<Box sx={{ borderRadius: 1, border: "2px solid purple", display: "inline-flex", alignItems: "center" }}>
						<EmojiEvents sx={{ fontSize: "1rem", mr: 1, mb: "2px", fontVariant: "body2", color: "purple" }} />
						<Typography mr={1} variant="body2" color="purple">{props.fameRating}</Typography>
					</Box>
				</Box>
				<Box sx={{ mb: 2 }}>
					<Box sx={{ display: "flex", alignItems: "center" }}>
						<LocationOn sx={{ fontSize: "1rem", mr: 1, mb: "2px", fontVariant: "body2", color: "text.secondary" }} />
						<Typography variant="body2" color="text.secondary">À {Math.round(props.distance)} km</Typography>
					</Box>
					<Box sx={{ display: "flex", alignItems: "center" }}>
						<Circle sx={{ fontSize: "1rem", mr: 1, mb: "2px", fontVariant: "body2", color: props.connected ? "green" : "red" }} />
						<Typography variant="body2" color="text.secondary">{props.connected ? "Connected" : "Last seen " + props.lastTime}</Typography>
					</Box>
					<Box sx={{ display: "flex", alignItems: "center" }}>
						<FavoriteBorder sx={{ fontSize: "1rem", mr: 1, mb: "2px", fontVariant: "body2", color: "text.secondary" }} />
						<Typography variant="body2" color="text.secondary">{props.linkStatus}</Typography>
					</Box>
				</Box>
				<UserInterestsList interests={props.interests} />
				<Box sx={{ mb: 2 }}>
					<Typography
						variant="body1"
						component="blockquote"
						sx={{
							fontStyle: "italic",
							borderLeft: "4px solid #ccc",
							paddingLeft: "1rem",
							color: "#555",
							marginBottom: "1rem",
						}}
					>
						{props.biography}
					</Typography>
				</Box>
				<Box>
					<Button variant="contained" onClick={props.like} sx={{ mr: 1, mb: 1 }}><Recommend sx={{ mr: 1 }} /> {props.liked ? "UNLIKE" : "LIKE"}</Button>
					<Button variant="contained" onClick={props.block} sx={{ mr: 1, mb: 1 }}><NotInterested sx={{ mr: 1 }} /> {props.blocked ? "UNBLOCK" : "BLOCK"}</Button>
					<Button variant="contained" onClick={props.report} color="error" sx={{ mr: 1, mb: 1 }}><Flag sx={{ mr: 1 }} /> {props.reported ? "CANCEL REPORT" : "REPORT"}</Button>
				</Box>
			</Box>
		</Box>
	);
};

export default Profile;