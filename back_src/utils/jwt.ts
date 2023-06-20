import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import { newJwt } from "../../comon_src/type/jwt.type";
import JwtDb from "../database/jwt.db";
dotenv.config();

const secretKey = process.env.JWT_SECRET || "";
const secretKeyR = process.env.JWT_SECRETR || "";
const jwtDb = new JwtDb;

if (!secretKey || !secretKeyR) {
	throw (".env look broken JWT_SECRET or JWT_SECRETR is missing");
}

export function generateJwt(userId: number): string {
	return jwt.sign({userId: userId}, secretKey);
}

export async function GenerateRefreshJwt(id: number): Promise<string> {
	const token = jwt.sign({ id }, secretKeyR, { expiresIn: "1week" });

	const decoded = jwt.verify(token, secretKeyR) as JwtPayload;
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const expirationDate = new Date(decoded.exp! * 1000);
	await jwtDb.insertToken(token, expirationDate);
	return token;
}

export async function validaterefreshJwt(token: string, id: number): Promise<boolean | 401> {
	try {
		const decoded = jwt.verify(token, secretKeyR) as jwt.JwtPayload;
		const valideToken = await jwtDb.tokenIsValide(token);
		if(!valideToken)
			return false;
		if (decoded.id != id)
			return false;
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

export async function askNewJwt(refreshToken: string, userId: number): Promise<newJwt> {
	
	const Vtoken = await validaterefreshJwt(refreshToken, userId);
	if (!Vtoken) {
		return { error: "token non valide" };
	}
	if (Vtoken === 401)
		return { error: "token expirer" };
	const newRefreshToken = await GenerateRefreshJwt(userId);
	jwtDb.invalidateToken(refreshToken);

	const newToken = generateJwt(userId);
	return { refreshToken: newRefreshToken, token: newToken };
	//TODO unvalidate old refresh token
}