import React, { useState, useEffect } from 'react'
import { Box } from '@mui/material'
import Profile from '../components/Profile'

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<any>({
    id: 0,
    username: 'leadupont',
    lastName: 'Dupont',
    firstName: 'Léa',
    biography: 'Je suis une catin et j\'en suis fier ! Que ça ne vous déplaise, plan sérieux s\'abstenir !',
    gender: 'Female',
    birthDate: '',
    orientation: 'Heterosexual',
    pictures: [{id: 1, src: '1690965605454.png'}, {id: 1, src: '1691332595896.png'}],
    interests: ['netflix', 'escalade'],
    latitude: '',
    longitude: '',
    distance: 16,
    age: 29,
    connected: false,
    lastTime: '16 min ago',
    linkStatus: 'likes you',
    fameRating: 7.65,
    liked: false,
    blocked: false,
    reported: false,
  })

  const like = () => {
    setProfile({...profile, liked: !profile.liked})
  }

  const block = () => {
    setProfile({...profile, blocked: !profile.blocked})
  }

  const report = () => {
    setProfile({...profile, reported: !profile.reported})
  }

  return (
    <Box>
      <Profile {...profile} like={like} block={block} report={report} />
    </Box>
  )
}

export default ProfilePage