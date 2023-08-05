import { UserProfile } from "../../comon_src/type/user.type";

export const prefixBackendUrl = (path: string) => {
  return path ? `${process.env.REACT_APP_BACKEND_URL}/images/${path}` : '';
}

export const isProfileIncomplete = (user: UserProfile) => {
  return user.username === '' ||
    user.firstName === '' ||
    user.lastName === '' ||
    user.gender === '' ||
    user.birthDate === '' ||
    user.orientation === '' ||
    user.interests.length === 0 ||
    user.biography === '' ||
    user.pictures.length === 0;
}

export const buildErrorString = (err: any, msg: string) => {
  if (err.response?.data?.error) {
    return `${msg} : ${err.response?.data?.error}`;
  }
  return msg;
}

export async function fetchLocation(printError: Function) {
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      try {
        await apiProvider.updatePositionByLL(position.coords.latitude.toString(), position.coords.longitude.toString())
      } catch (err) {
        printError(err)
      }
    },
    async (err) => {
      try {
        await apiProvider.updatePositionByIp()
      } catch (err) {
        printError(err)
      }
    }
  )
}