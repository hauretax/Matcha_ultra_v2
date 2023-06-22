import React from 'react'
import { Box } from '@mui/material'

import { useAuth } from '../context/AuthProvider'

import Caroussel from '../components/Caroussel'
import Biography from '../components/Biography'
import Interests  from '../components/Interests'
import UserInformation from '../components/UserInformation'

function ProfilePage() {
  const auth = useAuth();

  return (
    <Box>
      <Caroussel imgs={auth.user.pictures} />
      <Biography biography='Je suis un texte'/>
      <Interests interests={['vegan']} options={['meat', 'sport', 'hard work', 'god', 'reading', 'swimming', 'hiking in the mountains', 'bikes', 'crypto', 'math', 'philosophy']}/>
      <UserInformation firstName='Antoine' lastName='Labalette' age={26} gender='Male' orientation='Heterosexual' email='labalette.antoine@gmail.com' />
    </Box>
  )
}

export default ProfilePage
