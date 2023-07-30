import React, { useEffect, useState } from 'react';

import apiProvider from '../services/apiProvider';
import { Box, Button } from '@mui/material';
import SearchForm from '../components/SearchForm';
import BrowsingResult from '../components/BrowsingResult';

import { filtersList } from '../../../comon_src/type/utils.type';

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

  const fetchProfiles = async (index: number) => {
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
    setEnd(newProfiles.length < 10)
  }

  useEffect(() => {
    handleSearch()
  }, [])

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <SearchForm filters={filters} setFilters={setFilters} handleSearch={handleSearch} />
      <BrowsingResult users={profiles} />
      {!end && <Button sx={{ marginTop: 2 }} variant="contained" onClick={handleNext}>LOAD MORE...</Button>}
    </Box>
  )
}

export default BrowsePage;