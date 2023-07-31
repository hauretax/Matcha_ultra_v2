import React, { useCallback, useEffect, useState } from "react";
import apiProvider from "../services/apiProvider";
import { Box, Button, Grid } from "@mui/material";

import AgeFilter from "./AgeFilter";
import DistanceFilter from "./DistanceFilter";
import OrientationFilter from "./OrientationFilter";
import InterestsFilter from "./InterestsFilter";
import OrderByFilter from "./OrderByFilter";

import { filtersList } from "../../../comon_src/type/utils.type";

interface SearchFormProps {
  setFilters: React.Dispatch<React.SetStateAction<filtersList>>
}

const SearchForm: React.FC<SearchFormProps> = ({ setFilters }) => {
  const [options, setOptions] = useState<string[]>([])
  const [tmpFilters, setTmpFilters] = useState<filtersList>({
    ageRange: [18, 25],
    distance: 100,
    orientation: ['Female'],
    interests: [],
    orderBy: 'distance'
  })

  useEffect(() => {
    const fetchOptions = async () => {
      const res = await apiProvider.getOptions()
      setOptions(res.data)
    }
    fetchOptions()
  }, [])

  const setAgeRange = useCallback((ageRange: number[]) => {
    setTmpFilters((prev) => ({ ...prev, ageRange: ageRange }))
  }, [])

  const setDistance = useCallback((distance: number) => {
    setTmpFilters((prev) => ({ ...prev, distance: distance}))
  }, [])

  const setOrientation = useCallback((orientation: ('Female' | 'Male' | 'Other')[]) => {
    setTmpFilters((prev) => ({ ...prev, orientation: orientation}))
  }, [])

  const setInterests = useCallback((interests: string[]) => {
    setTmpFilters((prev) => ({ ...prev, interests: interests}))
  }, [])

  const setOrderBy = useCallback((orderBy: 'distance' | 'age' | 'tag' | 'popularity') => {
    setTmpFilters((prev) => ({ ...prev, orderBy: orderBy}))
  }, [])

  return (
    <Box sx={{ marginBottom: '1rem'}}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <AgeFilter ageRange={tmpFilters.ageRange} setAgeRange={setAgeRange} />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <DistanceFilter distance={tmpFilters.distance} setDistance={setDistance} />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <OrientationFilter orientation={tmpFilters.orientation} setOrientation={setOrientation} />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <InterestsFilter options={options} interests={tmpFilters.interests} setInterests={setInterests} />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <OrderByFilter orderBy={tmpFilters.orderBy} setOrderBy={setOrderBy} />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <Button fullWidth variant="contained" onClick={() => setFilters(tmpFilters)}>Search</Button>
        </Grid>
      </Grid>
    </Box>
  )
}

export default SearchForm;