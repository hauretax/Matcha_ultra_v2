import React, { useEffect } from "react";
import { Box } from "@mui/material";

import Caroussel from "../components/Caroussel";
import Biography from "../components/Biography";
import Interests from "../components/Interests";
import UserInformation from "../components/UserInformation";
import { useLocation } from "react-router-dom";
import { useSnackbar } from "../context/SnackBar";
import { useAuth } from "../context/AuthProvider";
import { PersonalProfile } from "../../../comon_src/type/user.type";

//TODO: best way to do it would be to stop fetching all info into context and just use context to store wether user is connected or not / profile is complete or not
function PersonalProfilePage() {
	const auth = useAuth();
	let user: PersonalProfile;
	const location = useLocation();
	const snackbar = useSnackbar();

	useEffect(() => {
		if (location.state?.profileIncomplete) snackbar("Tell us a bit more about yourself before meeting other people", "info");
	}, [location.state?.profileIncomplete, snackbar]);

	if (auth.user !== null) {
		user = auth.user;
	} else {
		return (<Box></Box>);
	}

	return (
		<Box>
			<Caroussel imgs={user.pictures} />
			<Biography biography={user.biography} />
			<Interests interests={user.interests} />
			<UserInformation {...user} />
		</Box>
	);
}

export default PersonalProfilePage;
