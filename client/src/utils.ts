import { UserProfile } from "../../comon_src/type/user.type";
import axios from 'axios';

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

export async function getLocationByIp() {
  const ipAddress = window.location?.hostname;
  console.log(ipAddress)
  axios.get('http://localhost:8080/api/test')

  //  const headers = {
//     'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36'
// }
// try {
//   const response = await axios.get('https://api.ip2location.io/?key=AB4DE8353DFB2A72E2650F5C872F0724&ip=62.210.33.170', { headers });
//   console.log(response.data);
// } catch (error:any) {
//   console.error('An error occurred:', error.message);
// }
}