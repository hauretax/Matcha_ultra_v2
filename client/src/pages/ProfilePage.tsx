import React, { useEffect, useState } from 'react'
import { Box } from '@mui/material'

import fakeApiProvider from '../services/fakeApiProvider'

import Caroussel from '../components/Caroussel'
import Biography from '../components/Biography'
import Interests from '../components/Interests'
import UserInformation from '../components/UserInformation'

const initialProfile = {
  biography: 'test',
  interests: [],
  firstName: '',
  lastName: '',
  age: 0,
  gender: '',
  orientation: '',
  email: '',
  pictures: [null, null, null, null, null]
}

function ProfilePage() {
  const [profile, setProfile] = useState(initialProfile)
  const [options, setOptions] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    fakeApiProvider.getProfile()
      .then((res: any) => {
        setProfile(res.data)
        setIsLoading(false)
      })
  }, [])

  useEffect(() => {
    fakeApiProvider.getOptions()
      .then((res: any) => {
        setOptions(res.data)
      })
  }, [])

  return (
    <Box>
      <Caroussel imgs={profile.pictures} isLoading={isLoading} />
      <Biography biography={profile.biography} isLoading={isLoading} />
      <Interests interests={profile.interests} options={options} isLoading={isLoading} />
      <UserInformation firstName={profile.firstName} lastName={profile.lastName} age={profile.age} gender={profile.gender} orientation={profile.orientation} email={profile.email} isLoading={isLoading} />
    </Box>

  )
}

export default ProfilePage
