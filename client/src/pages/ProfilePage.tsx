import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import Profile from "../components/Profile";
import { useParams } from "react-router-dom";
import apiProvider from "../services/apiProvider";
import { buildErrorString } from "../utils";
import { useSnackbar } from "../context/SnackBar";
import { ErrorResponse } from "../../../comon_src/type/error.type";
import { UserProfile } from "../../../comon_src/type/user.type";

const ProfilePage: React.FC = () => {
	const [profile, setProfile] = useState<UserProfile>({
		id: 0,
		username: "",
		lastName: "",
		firstName: "",
		biography: "",
		gender: "",
		birthDate: "",
		preferences: [],
		pictures: [],
		interests: [],
		latitude: "",
		longitude: "",
		distance: 0,
		age: 0,
		connected: false,
		lastTime: "",
		linkStatus: "",
		fameRating: 0,
		liked: false,
		blocked: false,
		reported: false,
	});
	const { id } = useParams<{ id: string }>();
	const snackbar = useSnackbar();

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				if (id !== undefined) {
					const res = await apiProvider.getProfile(id);
					setProfile(res.data);
					await apiProvider.visit(parseInt(id));
				}
			} catch (err) {
				snackbar(buildErrorString(err as ErrorResponse, "Failed to fetch profile"), "error");
			}
		};

		fetchProfile();
	}, [id, snackbar]);


	const like = async () => {
		try {
			await apiProvider.like(profile.id, !profile.liked);
			setProfile({ ...profile, liked: !profile.liked });
		} catch (err) {
			snackbar(buildErrorString(err as ErrorResponse, "Failed to like profile"), "error");
		}
	};

	const block = () => {
		setProfile({ ...profile, blocked: !profile.blocked });
	};

	const report = () => {
		setProfile({ ...profile, reported: !profile.reported });
	};

	return (
		<Box>
			<Profile {...profile} like={like} block={block} report={report} />
		</Box>
	);
};

export default ProfilePage;