import React from 'react'
import { Paper } from '@mui/material'

import { useAuth } from '../context/AuthProvider'

import Caroussel from '../components/Caroussel'

function ProfilePage() {
  const auth = useAuth();

  return (
    <Caroussel imgs={auth.user.pictures}/>
  )
}

export default ProfilePage
