import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { newJwt } from "../../comon_src/type/jwt.type";
dotenv.config();

const secretKey = process.env.JWT_SECRET || '';
const secretKeyR = process.env.JWT_SECRETR || '';

if(!secretKey || !secretKeyR){
	throw('.env look broken JWT_SECRET or JWT_SECRETR is missing');
}

export function GenerateJwt(id: string) {
	return jwt.sign({ id }, secretKey, { expiresIn: '1h' });
}

export function GenerateRefreshJwt(id: string) {
	return jwt.sign({ id }, secretKeyR, { expiresIn: '1week' });
}

//j'ai fait deux fois la meme fonction pour eviter de sortire les cle priver de se fichier
export function validaterefreshJwt(token: string, id: string): boolean | 401 {
	try {
		const decoded = jwt.verify(token, secretKeyR) as jwt.JwtPayload;
		if (decoded.id != id)
			return false
		return true
	} catch (err) {
		if (err.message == 'jwt expired')
			return 401 //401 correspond a l'erreur http
		return false
	}
}

export function validateJwt(token: string, id: string): boolean | 401 {
	try {
		const decoded = jwt.verify(token, secretKey) as jwt.JwtPayload;
		if (decoded.id != id)
			return false
		return true
	} catch (err) {
		if (err.message == 'jwt expired')
			return 401 //401 correspond a l'erreur http
		return false
	}
}

export function askNewJwt(token:string, id:string):newJwt{
	const Vtoken = validaterefreshJwt(token,id)
	if (!Vtoken){
		return {error:'token non valide'}
	}
	if(Vtoken === 401)
		return {error:'token expirer'}
	return {refreshToken: GenerateRefreshJwt(id), token: GenerateJwt(id)}
}