import React from 'react';
import { Grid } from '@mui/material';
import UserCard from './UserCard';

interface BrowsingResultProps {
  users: any[];
  handleLike: (userId: number, liked: boolean) => void;
}

const BrowsingResult: React.FC<BrowsingResultProps> = ({ users, handleLike }) => {
  return (
      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
        {users.map((user, index) => (
          <Grid item xs={4} sm={4} md={4} key={index}>
            <UserCard user={user} handleLike={handleLike} />
          </Grid>
        ))}
      </Grid>
  )
}

export default BrowsingResult;