import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
import { payload } from '../../comon_src/type/jwt.type';
dotenv.config();

const secretKey = process.env.JWT_SECRET

export function GenerateJwt(payload: payload) {
    return jwt.sign(payload, secretKey)
}

export function decodJwt(token: string) {
    return jwt.verify(token, secretKey)
}