import React, { useEffect, useState } from "react";
import apiProvider from "../services/apiProvider";
import { Box, Button, Grid } from "@mui/material";

import AgeFilter from "./AgeFilter";

interface SearchFormProps {
  filters: {
    ageRange: number[];
  };
  setFilters: React.Dispatch<React.SetStateAction<{
    ageRange: number[];
  }>>;
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

  const setAgeRange = (ageRange: number[]) => {
    setFilters((prev) => ({ ...prev, ageRange: ageRange }))
  }

  return (
    <Box sx={{ marginBottom: '1rem'}}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <AgeFilter ageRange={filters.ageRange} setAgeRange={setAgeRange} />

        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <Button variant="contained" onClick={handleSearch}>Search</Button>
        </Grid>
      </Grid>
    </Box>
  )
}

export default SearchForm;