import React, { useCallback, useEffect, useState } from "react";
import apiProvider from "../services/apiProvider";
import { Box, Button, Grid } from "@mui/material";

import AgeFilter from "./AgeFilter";
import DistanceFilter from "./DistanceFilter";

import { filtersList } from "../../../comon_src/type/utils.type";

interface SearchFormProps {
  filters: filtersList
  setFilters: React.Dispatch<React.SetStateAction<filtersList>>;
  handleSearch: () => void;
}

const SearchForm: React.FC<SearchFormProps> = ({ filters, setFilters, handleSearch }) => {
  const [options, setOptions] = useState<string[]>([])

  useEffect(() => {
    const fetchOptions = async () => {
      const res = await apiProvider.getOptions()
      setOptions(res.data)
    }
    fetchOptions()
  }, [])

  const setAgeRange = useCallback((ageRange: number[]) => {
    setFilters((prev) => ({ ...prev, ageRange: ageRange }))
  }, [])

  const setDistance = useCallback((distance: number) => {
    setFilters((prev) => ({ ...prev, distance: distance}))
  }, [])

  const setOrientation = useCallback((orientation: ('Female' | 'Male' | 'Other')[]) => {
    setFilters((prev) => ({ ...prev, orientation: orientation}))
  }, [])

  const setInterests = useCallback((interests: string[]) => {
    setFilters((prev) => ({ ...prev, interests: interests}))
  }, [])

  const setOrderBy = useCallback((orderBy: 'distance' | 'age' | 'tag' | 'popularity') => {
    setFilters((prev) => ({ ...prev, orderBy: orderBy}))
  }, [])

  return (
    <Box sx={{ marginBottom: '1rem'}}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <AgeFilter ageRange={filters.ageRange} setAgeRange={setAgeRange} />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <DistanceFilter distance={filters.distance} setDistance={setDistance} />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <Button variant="contained" onClick={handleSearch}>Search</Button>
        </Grid>
      </Grid>
    </Box>
  )
}

export default SearchForm;