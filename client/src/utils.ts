import { UserProfile } from "../../comon_src/type/user.type";
import apiProvider from "./services/apiProvider";

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