import { UserProfile } from "../../comon_src/type/user.type";

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
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    alert("La géolocalisation n'est pas prise en charge par votre navigateur.");
  }
}

function showPosition(position:any) {
  var latitude = position.coords.latitude;
  var longitude = position.coords.longitude;
  alert("Latitude: " + latitude + "\nLongitude: " + longitude);
}

export function getLocationByIp() {

}