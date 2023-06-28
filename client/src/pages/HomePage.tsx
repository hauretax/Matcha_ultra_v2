import React, { useEffect, useState } from "react";
import { Skeleton } from "@mui/material";

import { UserProfile } from "../../../comon_src/type/user.type";
import apiProvider from "../services/apiProvider";

function HomePage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const res = await apiProvider.getUsers()
      setUsers(res.data)
      setIsLoading(false)
    };

    fetchData();
  }, []);

  return (
    <div>
      {isLoading ? (
        <Skeleton variant="rectangular" width="100%" height="100vh" />
      ) : (
        <div>
          {users.map((user) => (
            <div key={user.id}>
              <p>{user.firstName}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default HomePage;