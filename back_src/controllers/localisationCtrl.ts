import axios from "axios";
import dotenv from "dotenv";
import { Response, Request } from "express";
import UpdateDb from "../database/Update.db";

dotenv.config();

export async function setUserPosition(req: Request, res: Response) {
  const { latitude, longitude } = req.body;

  if (!latitude || !longitude) {
    res.status(400).json({ message: "missing params" });
    return;
  }

  await UpdateDb.update('users', ['latitude', 'longitude'], [latitude, longitude], ['id'], [res.locals.fulluser.id]);
  res.sendStatus(200);
}

export async function setUserPositionByIP(req: Request, res: Response) {
  //since we are running on localhost, we are not using wifi and therefore needs to use an external service to get our ip
  const { data: { ip } } = await axios.get("https://api.ipify.org?format=json");

  if (ip !== res.locals.fulluser.ip) {
    try {
      const { data: { loc } } = await axios.get(`https://ipinfo.io/${ip}?token=${process.env.IPINFO_API_KEY}`)
      const [latitude, longitude] = loc.split(',');
      await UpdateDb.update('users', ['latitude', 'longitude', 'ip'], [latitude, longitude, ip], ['id'], [res.locals.fulluser.id]);
      res.sendStatus(200)
    } catch (error) {
      console.error('Erreur lors de la récupération de la localisation :', error.message);
      res.sendStatus(500)
    }
  } else {
    res.sendStatus(200)
  }
}