import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { possiblyNewJwt } from "../../comon_src/type/jwt.type";
import JwtDb from "../database/Jwt.db";
dotenv.config();

const secretKey = process.env.JWT_SECRET || "";
const secretKeyR = process.env.JWT_SECRETR || "";

if (!secretKey || !secretKeyR) {
	throw (".env look broken JWT_SECRET or JWT_SECRETR is missing");
}

export function generateJwt(userId: number): string {
	return jwt.sign({ userId: userId }, secretKey, { expiresIn: "1h" });
}

export async function GenerateRefreshJwt(id: number): Promise<string> {
	const token = jwt.sign({ id }, secretKeyR, { expiresIn: "1week" });
	await JwtDb.insertToken(token, id);
	return token;
}

export async function validaterefreshJwt(token: string, id: number): Promise<boolean | 401> {
	try {
		const valideToken = await JwtDb.getToken(id);
		console.log('vt:', valideToken)
		console.log('token:', token)

		if (valideToken !== token)
			return false;
		// const decoded = jwt.verify(token, secretKeyR) as jwt.JwtPayload;
		// if(!valideToken)
		// 	return false;
		// if (decoded.id != id)
		// 	return false;
		return true;
	} catch (err) {
		if (err.message == "jwt expired")
			return 401; //401 correspond a l'erreur http
		return false;
	}
}

export function validateJwt(token: string, id: number): boolean | 401 {
	try {
		const decoded = jwt.verify(token, secretKey) as jwt.JwtPayload;
		if (decoded.userId != id)
			return false;
		return true;
	} catch (err) {
		if (err.message == "jwt expired")
			return 401; //401 correspond a l'erreur http
		return false;
	}
}

export async function askNewJwt(refreshToken: string, userId: number): Promise<possiblyNewJwt> {

	const Vtoken = await validaterefreshJwt(refreshToken, userId);
	if (!Vtoken) {
		return { error: "token non valide" };
	}
	if (Vtoken === 401)
		return { error: "token expirer" };
	const newRefreshToken = await GenerateRefreshJwt(userId);

	const newToken = generateJwt(userId);
	return { refreshToken: newRefreshToken, token: newToken };
	//TODO unvalidate old refresh token
}