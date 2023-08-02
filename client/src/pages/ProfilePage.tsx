import React, { useEffect, useState } from 'react'
import { Box } from '@mui/material'

import apiProvider from '../services/apiProvider'

import Caroussel from '../components/Caroussel'
import Biography from '../components/Biography'
import Interests from '../components/Interests'
import UserInformation from '../components/UserInformation'
import { useLocation, useParams } from 'react-router-dom'
import { useSnackbar } from '../context/SnackBar'
import { useAuth } from '../context/AuthProvider'
import { buildErrorString } from '../utils'
import { UserProfile } from '../../../comon_src/type/user.type'


function ProfilePage() {
  const auth = useAuth()
  const [user, setUser] = useState<UserProfile>({
    id: 0,
    username: '',
    lastName: '',
    firstName: '',
    biography: '',
    gender: '',
    birthDate: '',
    orientation: '',
    pictures: [],
    interests: [],
    latitude: '',
    longitude: '',
    distance: 0,
    age: 0,
  })
  const [options, setOptions] = useState<string[]>([])
  const location = useLocation();
  let snackbar = useSnackbar()
  const { id } = useParams<{ id: string }>()

  useEffect(() => {
    apiProvider.getOptions()
      .then((res: any) => {
        setOptions(res.data)
      })
      .catch((err: any) => {
        snackbar(buildErrorString(err, "Error while fetching interest list"), "error")
      })
  }, [snackbar])

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await apiProvider.getProfile(id!)
        setUser(res.data)
      } catch (err: any) {
        snackbar(buildErrorString(err, "Error while fetching user"), "error")
      }
    }

    if (id) 
      fetchUser()
    else
      setUser(auth.user!)
  }, [id, auth.user, snackbar])


  useEffect(() => {
    if (location.state?.profileIncomplete) snackbar("Tell us a bit more about yourself before meeting other people", "info")
  }, [location.state?.profileIncomplete, snackbar])


  //TODO: extract props from UserInformation

  return (
    <Box>
      <Caroussel readOnly={id != undefined} imgs={user.pictures} />
      <Biography biography={auth.user!.biography} />
      <Interests interests={auth.user!.interests} options={options} updateDb={true} />
      <UserInformation firstName={auth.user!.firstName} lastName={auth.user!.lastName} birthDate={auth.user!.birthDate} gender={auth.user!.gender} orientation={auth.user!.orientation} email={auth.user!.email} customLocation={auth.user!.customLocation} latitude={auth.user!.latitude} longitude={auth.user!.longitude} />
    </Box>

  )
}

export default ProfilePage
