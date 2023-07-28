import React from "react";
import { Box, Chip } from "@mui/material";

interface UserInterestsListProps {
  interests: string[];
}

const UserInterestsList: React.FC<UserInterestsListProps> = ({ interests }) => {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', mt: 1, overflow: "hidden",  height: "32px" }}>
      {
        interests.map((interest, index) => (
          <Chip
            key={index}
            label={`#${interest}`
            }
            style={{ marginRight: '0.5rem' }}
          />
        ))
      }
    </Box>
  );
}

export default UserInterestsList;