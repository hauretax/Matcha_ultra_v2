import jwt from "jsonwebtoken";
import { GenerateJwt, GenerateRefreshJwt, askNewJwt, validateJwt } from "../back_src/utils/jwt";
import { newJwt } from "../comon_src/type/jwt.type";
import Dbhandler from "../back_src/database/DbHandler";

const secretKey = process.env.JWT_SECRET;
const id = 'id'
const db = new Dbhandler;


if (!secretKey) {
	throw ('.env look broken');
}

describe("JWT Tests", () => {
	db.createRJWTTables();

	it("should generate and verify a JWT", () => {
		const token = GenerateJwt(id);
		expect(validateJwt(token, id)).toEqual(true);
	});
	it("should generate and unverify a JWT", () => {
		const token = GenerateJwt(id);
		expect(validateJwt(token, id + 's')).toEqual(false);
	});
	//j'imite le comportement que devrais avoir le front'
	it("should be expire and aske new token", () => {
		const token = jwt.sign({ id }, secretKey, { expiresIn: '1ms' });;
		const refreshToken = GenerateRefreshJwt(id)
		let newToken: newJwt;
		expect(validateJwt(token, id)).toEqual(401)
		newToken = askNewJwt(refreshToken, id)
		expect(newToken).toHaveProperty('refreshToken');
		expect(newToken).toHaveProperty('token')
	});
	it("should include a valid signed JWT in the request header", () => {
		const payload = { id };
		const token = jwt.sign(payload, secretKey);
		const req = {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		};
		const authHeader = req.headers.Authorization;
		const extractedToken = authHeader.split(" ")[1];
		const decoded = jwt.verify(extractedToken, secretKey) as jwt.JwtPayload;
		expect(decoded.id).toEqual(id);
	});
});
