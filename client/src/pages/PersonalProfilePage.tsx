import React, { useCallback, useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";

import Caroussel from "../components/Caroussel";
import Biography from "../components/Biography";
import Interests from "../components/Interests";
import UserInformation from "../components/UserInformation";
import { useLocation } from "react-router-dom";
import { useSnackbar } from "../context/SnackBar";
import { useAuth } from "../context/AuthProvider";
import { PersonalProfile, UserProfile } from "../../../comon_src/type/user.type";
import apiProvider from "../services/apiProvider";
import { buildErrorString } from "../utils";
import { ErrorResponse } from "../../../comon_src/type/error.type";
import BrowsingResult from "../components/BrowsingResult";

//TODO #14: best way to do it would be to stop fetching all info into context and just use context to store wether user is connected or not / profile is complete or not
function PersonalProfilePage() {
	const auth = useAuth();
	let user: PersonalProfile;
	const [profileLikes, setProfileLikes] = useState<UserProfile[]>([]);
	const [profileVisits, setProfileVisits] = useState<UserProfile[]>([]);
	const location = useLocation();
	const snackbar = useSnackbar();

	useEffect(() => {
		if (location.state?.profileIncomplete) snackbar("Tell us a bit more about yourself before meeting other people", "info");
	}, [location.state?.profileIncomplete, snackbar]);

	useEffect(() => {
		const fetchProfiles = async () => {
			try {
				const res = await apiProvider.getProfileLikes();
				setProfileLikes(res.data);
				const res2 = await apiProvider.getProfileVisits();
				setProfileVisits(res2.data);
			} catch (err) {
				snackbar(buildErrorString(err as ErrorResponse, "Failed to fetch profile likes"), "error");
			}
		};

		fetchProfiles();
	}, [snackbar]);

	if (auth.user !== null) {
		user = auth.user;
	} else {
		return (<Box></Box>);
	}

	const handleLike = useCallback(async (likeeId: number, status: boolean) => {
		try {
			await apiProvider.like(likeeId, status);
			setProfileLikes(prevProfiles =>
				prevProfiles.map(profile =>
					profile.id === likeeId ? { ...profile, liked: status } : profile
				)
			);
		} catch (err) {
			snackbar(buildErrorString(err as ErrorResponse, "Failed to like profile"), "error");
		}
	}, [snackbar]);

	const handleLikeVisit = useCallback(async (likeeId: number, status: boolean) => {
		try {
			await apiProvider.like(likeeId, status);
			setProfileVisits(prevProfiles =>
				prevProfiles.map(profile =>
					profile.id === likeeId ? { ...profile, liked: status } : profile
				)
			);
		} catch (err) {
			snackbar(buildErrorString(err as ErrorResponse, "Failed to like profile"), "error");
		}
	}, [snackbar]);

	return (
		<Box>
			<Caroussel imgs={user.pictures} />
			<Biography biography={user.biography} />
			<Interests interests={user.interests} />
			<UserInformation {...user} />
			<Box>
				<Typography component="h1" variant="h5" my={2}>
					Likes History
				</Typography>
				<BrowsingResult users={profileLikes} handleLike={handleLike} />
			</Box>
			<Box>
				<Typography component="h1" variant="h5" my={2}>
					Visits History
				</Typography>
				<BrowsingResult users={profileVisits} handleLike={handleLikeVisit} />
			</Box>
		</Box>
	);
}

export default PersonalProfilePage;
