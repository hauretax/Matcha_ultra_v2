import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const secretKey = process.env.JWT_SECRET;

export function generateJwt(userId: number): string {
	return jwt.sign({userId: userId.toString()}, secretKey);
}

export function decodJwt(token: string) {
	return jwt.verify(token, secretKey);
}