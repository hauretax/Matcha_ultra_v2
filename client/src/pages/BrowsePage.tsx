import React, { useCallback, useEffect, useState } from 'react';

import apiProvider from '../services/apiProvider';
import { Box, Button } from '@mui/material';
import SearchForm from '../components/SearchForm';
import BrowsingResult from '../components/BrowsingResult';

import { filtersList } from '../../../comon_src/type/utils.type';
import { useSnackbar } from '../context/SnackBar';
import { buildErrorString } from '../utils';

const BrowsePage: React.FC = () => {
  //TODO: initialize filters based on user's profile
  const [filters, setFilters] = useState<filtersList>({
    ageRange: [18, 25],
    distance: 100,
    orientation: ['Female'],
    interests: [],
    orderBy: 'distance'
  });
  const [index, setIndex] = useState(0);
  const [end, setEnd] = useState(true)
  const [profiles, setProfiles] = useState<any[]>([]);
  const snackbar = useSnackbar();

  const fetchProfiles = async (index: number) => {
    try {
      const res = await apiProvider.getUsers({
        latitude: 0,
        longitude: 0,
        distanceMax: filters.distance,
        ageMin: filters.ageRange[0],
        ageMax: filters.ageRange[1],
        orientation: filters.orientation,
        interestWanted: filters.interests,
        index: index,
        orderBy: filters.orderBy
      });
      return res.data;
    } catch (err: any) {
      snackbar(buildErrorString(err, "Error while fetching profiles"), "error")
      return [];
    }
  }

  const handleNext = async () => {
    if (end) return;
    const newProfiles = await fetchProfiles(index + 10);
    setProfiles([...profiles, ...newProfiles]);
    setIndex(index + profiles.length);
    setEnd(newProfiles.length < 10)
  }

  useEffect(() => {
    const handleSearch = async () => {
      const newProfiles = await fetchProfiles(0);
      setProfiles(newProfiles);
      setIndex(0);
      setEnd(newProfiles.length < 10);
    }

    handleSearch()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters])

  const handleLike = useCallback(async (likeeId: number, status: boolean) => {
    try {
      await apiProvider.like(likeeId, status)
      setProfiles(prevProfiles => 
        prevProfiles.map(profile => 
           profile.userId === likeeId ? { ...profile, liked: status } : profile
        )
     );     
    } catch (err) {
      snackbar(buildErrorString(err, 'Failed to like profile'), 'error')
    }
  }, [snackbar])

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <SearchForm setFilters={setFilters} />
      <BrowsingResult users={profiles} handleLike={handleLike} />
      {!end && <Button sx={{ marginTop: 2 }} variant="outlined" onClick={handleNext}>LOAD MORE...</Button>}
    </Box>
  )
}

export default BrowsePage;