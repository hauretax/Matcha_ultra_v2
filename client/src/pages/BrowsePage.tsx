import React, { useCallback, useEffect, useState } from "react";

import apiProvider from "../services/apiProvider";
import { Box, Button } from "@mui/material";
import SearchForm from "../components/SearchForm";
import BrowsingResult from "../components/BrowsingResult";

import { useAuth } from "../context/AuthProvider";
import { filtersList } from "../../../comon_src/type/utils.type";
import { useSnackbar } from "../context/SnackBar";
import { buildErrorString } from "../utils";
import { ErrorResponse } from "../../../comon_src/type/error.type";
import { UserProfile } from "../../../comon_src/type/user.type";

const BrowsePage: React.FC = () => {
	//TODO #13: initialize filters based on user's profile
	const [filters, setFilters] = useState<filtersList>({
		ageRange: [18, 25],
		distance: 100,
		fameRange: [0, 100],
		interests: [],
		orderBy: "distance"
	});
	const [index, setIndex] = useState(0);
	const [end, setEnd] = useState(true);
	const [profiles, setProfiles] = useState<UserProfile[]>([]);
	const snackbar = useSnackbar();
	const auth = useAuth() ;
	const { user } = auth;


	const fetchProfiles = async (index: number) => {
		try {
			const res = await apiProvider.getUsers({
				latitude: 0,
				longitude: 0,
				distanceMax: filters.distance,
				ageMin: filters.ageRange[0],
				ageMax: filters.ageRange[1],
				fameMin: filters.fameRange[0] / 100,
				fameMax: filters.fameRange[1] / 100,
				interestWanted: filters.interests,
				index: index,
				orderBy: filters.orderBy
			});
			return res.data;
		} catch (err) {
			snackbar(buildErrorString(err as ErrorResponse, "Error while fetching profiles"), "error");
			return [];
		}
	};

	const handleNext = async () => {
		if (end) return;
		const newProfiles = await fetchProfiles(index + 10);
		setProfiles([...profiles, ...newProfiles]);
		setIndex(index + profiles.length);
		setEnd(newProfiles.length < 10);
	};

	useEffect(() => {
		setFilters({ ...filters, interests: user?.interests || [] });	
	}, []);

	useEffect(() => {
		const handleSearch = async () => {
			const newProfiles = await fetchProfiles(0);
			setProfiles(newProfiles);
			setIndex(0);
			setEnd(newProfiles.length < 10);
		};

		handleSearch();
	}, [filters]);

	const handleLike = useCallback(async (likeeId: number, status: boolean) => {
		try {
			await apiProvider.like(likeeId, status);
			setProfiles(prevProfiles => 
				prevProfiles.map(profile => 
					profile.id === likeeId ? { ...profile, liked: status } : profile
				)
			);     
		} catch (err) {
			snackbar(buildErrorString(err as ErrorResponse, "Failed to like profile"), "error");
		}
	}, [snackbar]);

	return (
		<Box sx={{ display: "flex", flexDirection: "column" }}>
			<SearchForm setFilters={setFilters} />
			<BrowsingResult users={profiles} handleLike={handleLike} />
			{!end && <Button sx={{ marginTop: 2 }} variant="outlined" onClick={handleNext}>LOAD MORE...</Button>}
		</Box>
	);
};

export default BrowsePage;