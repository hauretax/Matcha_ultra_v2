import axios from "axios";
import dotenv from "dotenv";
import { Response, Request } from "express";
import { Ip2Location } from "../../comon_src/type/utils.type";
import UpdateDb from "../database/Update.db";

dotenv.config();

function callToip2locationApi(ip: string): Promise<{data: Ip2Location} > {
	const headers = {
		"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36"
	};
	return axios.get("https://api.ip2location.io/?key=" + process.env.IP2_API_KEY + "&ip=" + ip, { headers });
}
export default async function setUserPosition(req: Request, res: Response) {


	let { ip, latitude, longitude } = req.body;
	if (ip === "localhost")
		ip = "8.8.8.8";
	if (!latitude && !longitude) {
		if (!ip) {
			res.status(400).json({ message: "missing params" });
			return;
		}

		const ip2Data: {data: Ip2Location} = await callToip2locationApi(ip);
		latitude = ip2Data.data.latitude;
		longitude = ip2Data.data.longitude;
	}
	await UpdateDb.setUserlocalisation(latitude, longitude, res.locals.fulluser.id);
	res.sendStatus(200);
}