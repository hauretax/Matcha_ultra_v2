import React, { useState } from 'react';

import apiProvider from '../services/apiProvider';
import { Box, Button } from '@mui/material';
import SearchForm from '../components/SearchForm';
import BrowsingResult from '../components/BrowsingResult';

const BrowsePage: React.FC = () => {
  //TODO: initialize filters based on user's profile
  const [filters, setFilters] = useState({
    ageRange: [18, 99],
  });
  const [index, setIndex] = useState(0);
  const [end, setEnd] = useState(false)
  const [profiles, setProfiles] = useState<any[]>([]);

  const fetchProfiles = async (index: number) => {
    const res = await apiProvider.getUsers({
      latitude: 0,
      longitude: 0,
      distanceMax: 200,
      ageMin: filters.ageRange[0],
      ageMax: filters.ageRange[1],
      orientation: ['Female'],
      interestWanted: [],
      index: index,
      orderBy: 'distance'
    });
    return res.data;
  }

  const handleSearch = async () => {
    const newProfiles = await fetchProfiles(0);
    setProfiles(newProfiles);
    setIndex(0);
    setEnd(newProfiles.length < 10);
  }

  const handleNext = async () => {
    if (end) return;
    const newProfiles = await fetchProfiles(index + 10);
    setProfiles([...profiles, ...newProfiles]);
    setIndex(index + profiles.length);
    setEnd(profiles.length < 10)
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <SearchForm filters={filters} setFilters={setFilters} handleSearch={handleSearch} />
      <BrowsingResult users={profiles} />
      <Button sx={{marginTop: 2}} variant="contained" onClick={handleNext}>LOAD MORE...</Button>
    </Box>
  )
}

export default BrowsePage;