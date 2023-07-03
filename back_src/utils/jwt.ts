import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { accessTokenList } from "../../comon_src/type/jwt.type";
import InsertDb from "../database/Insert.db";
import GetDb from "../database/Get.db";
dotenv.config();

const secretKey = process.env.JWT_SECRET || "";
const secretKeyR = process.env.JWT_SECRETR || "";

if (!secretKey || !secretKeyR) {
	throw (".env look broken JWT_SECRET or JWT_SECRETR is missing");
}

export function generateJwt(userId: number): string {
	return jwt.sign({ userId: userId, nonce: Math.random() }, secretKey, { expiresIn: "1h" });
}

export async function generateRefreshJwt(id: number): Promise<string> {
	const token = jwt.sign({ userId: id, nonce: Math.random() }, secretKeyR, { expiresIn: "1week" });
	await InsertDb.jwtToken(token, id);
	return token;
}


export async function validaterefreshJwt(token: string): Promise<number | null> {
	const decoded = jwt.verify(token, secretKeyR) as jwt.JwtPayload;
	const validToken = await GetDb.jwtToken(decoded.userId);
	if (validToken && validToken.token === token)
		return decoded.userId;
	return null;
}



export function validateJwt(token: string): number | null {
	try {
		const decoded = jwt.verify(token, secretKey) as jwt.JwtPayload;
		return decoded.userId;
	} catch {
		return null;
	}
}

export async function askNewJwt(refreshToken: string): Promise<accessTokenList> {

	const userId = await validaterefreshJwt(refreshToken);

	if (!userId) {
		throw new Error("token not valid");
	}

	const newRefreshToken = await generateRefreshJwt(userId);
	const newToken = generateJwt(userId);

	return { refreshToken: newRefreshToken, token: newToken };
}