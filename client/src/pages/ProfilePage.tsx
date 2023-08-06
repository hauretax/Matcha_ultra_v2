import React, { useEffect } from 'react'
import { Box } from '@mui/material'

import Caroussel from '../components/Caroussel'
import Biography from '../components/Biography'
import Interests from '../components/Interests'
import UserInformation from '../components/UserInformation'
import { useLocation } from 'react-router-dom'
import { useSnackbar } from '../context/SnackBar'
import { useAuth } from '../context/AuthProvider'
import { UserProfile } from '../../../comon_src/type/user.type'


function ProfilePage() {
  const auth = useAuth()
  const user: UserProfile = auth.user!
  const location = useLocation()
  const snackbar = useSnackbar()

  useEffect(() => {
    if (location.state?.profileIncomplete) snackbar("Tell us a bit more about yourself before meeting other people", "info")
  }, [location.state?.profileIncomplete, snackbar])

  return (
    <Box>
      <Caroussel imgs={user.pictures} />
      <Biography biography={user.biography} />
      <Interests interests={user.interests} />
      <UserInformation {...user} />
    </Box>
  )
}

export default ProfilePage
