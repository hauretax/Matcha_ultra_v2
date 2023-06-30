import { UserProfile } from "../../comon_src/type/user.type";
import axios from 'axios';
import apiProvider from "./services/apiProvider";

export const prefixBackendUrl = (path: string) => {
  return path ? `${process.env.REACT_APP_BACKEND_URL}/images/${path}` : '';
}

export const isProfileIncomplete = (user: UserProfile) => {
  return user.username === '' ||
    user.firstName === '' ||
    user.lastName === '' ||
    user.gender === '' ||
    user.age === 0 ||
    user.orientation === '' ||
    user.interests.length === 0 ||
    user.biography === '' ||
    user.pictures.length === 0;
}



export function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) =>
      apiProvider.updatePositionByLL(position.coords.latitude.toString(), position.coords.longitude.toString())
    )
  } else {
    getLocationByIp()
  }
}

export async function getLocationByIp() {
  const ip = window.location?.hostname;
  console.log(ip)
  apiProvider.updatePositionByIp(ip)
}