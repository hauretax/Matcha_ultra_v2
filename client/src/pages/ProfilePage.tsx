import React, { useEffect, useState } from 'react'
import { Box } from '@mui/material'

import apiProvider from '../services/apiProvider'

import Caroussel from '../components/Caroussel'
import Biography from '../components/Biography'
import Interests from '../components/Interests'
import UserInformation from '../components/UserInformation'
import { useLocation } from 'react-router-dom'
import { useSnackbar } from '../context/SnackBar'
import { useAuth } from '../context/AuthProvider'

function ProfilePage() {
  const auth = useAuth()
  const [options, setOptions] = useState<string[]>([])
  const location = useLocation();
  let snackbar = useSnackbar()

  useEffect(() => {
    apiProvider.getOptions()
      .then((res: any) => {
        setOptions(res.data)
      })
      .catch((err: any) => {
        snackbar(`${err.message}: Please reload the page`, "error")
      })
  }, [auth.user])

  useEffect(() => {
    if (location.state?.profileIncomplete) snackbar("Tell us a bit more about yourself before meeting other people", "info")
  }, [location.state?.profileIncomplete, snackbar])

  return (
    <Box>
      <Caroussel imgs={auth.user!.pictures} />
      <Biography biography={auth.user!.biography} />
      <Interests interests={auth.user!.interests} options={options} updateDb={true} />
      <UserInformation firstName={auth.user!.firstName} lastName={auth.user!.lastName} birthDate={auth.user!.birthDate} gender={auth.user!.gender} orientation={auth.user!.orientation} email={auth.user!.email} />
    </Box>

  )
}

export default ProfilePage
