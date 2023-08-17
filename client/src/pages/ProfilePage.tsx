import React, { useState, useEffect, useContext } from "react";
import { Box } from "@mui/material";
import Profile from "../components/Profile";
import { useParams } from "react-router-dom";
import apiProvider from "../services/apiProvider";
import { buildErrorString } from "../utils";
import { useSnackbar } from "../context/SnackBar";
import { ErrorResponse } from "../../../comon_src/type/error.type";
import { UserProfile } from "../../../comon_src/type/user.type";
import SocketContext from "../context/SocketProvider";
import { useAuth } from "../context/AuthProvider";

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
	const [isConnected, setIsConnected] = useState<boolean>(false);
	const { id } = useParams<{ id: string }>();
	const snackbar = useSnackbar();
	const [isSelfAccount, SetisSelfAccount] = useState<boolean>(false);
	const { connectedUsers } = useContext(SocketContext);
	const { user } = useAuth();

	useEffect(() => {
		if (!id)
			return;

		setIsConnected(connectedUsers.includes(parseInt(id)));
	}, [connectedUsers]);

	useEffect(() => {
		// i use == to compare string to number don t transform to ===
		SetisSelfAccount(user?.id == id);
		const fetchProfile = async () => {
			try {
				if (id !== undefined) {
					const res = await apiProvider.getProfile(id);
					const relation = await apiProvider.getRelation(parseInt(id));
					setProfile({ ...res.data, linkStatus: relation.data.relation });
					
					await apiProvider.visit(parseInt(id));
				}
			} catch (err) {
				snackbar(buildErrorString(err as ErrorResponse, "Failed to fetch profile"), "error");
			}
		};

		fetchProfile();
	}, [id, snackbar]);


	const like = async () => {
		if(isSelfAccount){
			snackbar("you can't like yourself",  "warning");
			return ;
		}
		try {
			await apiProvider.like(profile.id, !profile.liked);
			setProfile({ ...profile, liked: !profile.liked });
		} catch (err) {
			snackbar(buildErrorString(err as ErrorResponse, "Failed to like profile"), "error");
		}
	};

	const block = async () => {
		if(isSelfAccount){
			snackbar("you can't block yourself",  "warning");
			return ;
		}
		try {
			await apiProvider.block(profile.id, !profile.blocked);
			setProfile({ ...profile, blocked: !profile.blocked });
		} catch (err) {
			snackbar(buildErrorString(err as ErrorResponse, "Failed to block profile"), "error");
		}
	};

	const report = async () => {
		if(isSelfAccount){
			snackbar("you can't report yourself",  "warning");
			return ;
		}
		try {
			await apiProvider.report(profile.id);
			snackbar("Profile successfully reported", "success");
		} catch (err) {
			snackbar(buildErrorString(err as ErrorResponse, "Failed to report profile"), "error");
		}
	};

	return (
		<Box>
			<Profile {...profile} connected={isConnected} like={like} block={block} report={report} />
		</Box>
	);
};

export default ProfilePage;