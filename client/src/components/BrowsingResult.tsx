import React from 'react';
import { Grid } from '@mui/material';
import UserCard from './UserCard';

interface BrowsingResultProps {
  users: any[];
}

const BrowsingResult: React.FC<BrowsingResultProps> = ({ users }) => {
  return (
      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
        {users.map((user, index) => (
          <Grid item xs={2} sm={4} md={4} key={index}>
            <UserCard user={user} />
          </Grid>
        ))}
      </Grid>
  )
}

export default BrowsingResult;