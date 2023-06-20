import jwt from "jsonwebtoken";
import { generateJwt, GenerateRefreshJwt, askNewJwt, validateJwt } from "../back_src/utils/jwt";
import Dbhandler from "../back_src/database/DbHandler";

const secretKey = process.env.JWT_SECRET;
const id = "id";
const db = new Dbhandler;


if (!secretKey) {
	throw (".env look broken");
}

describe("JWT Tests", () => {
	db.createRJWTTables();

	it("should generate and verify a JWT", () => {
		const token = generateJwt(id);
		expect(validateJwt(token, id)).toEqual(true);
	});
	it("should generate and unverify a JWT", () => {
		const token = generateJwt(id);
		expect(validateJwt(token, id + "s")).toEqual(false);
	});
	//j'imite le comportement que devrais avoir le front'
	it("should be expire and aske new token", async () => {
		const token = jwt.sign({ id }, secretKey, { expiresIn: "1ms" });
		expect(validateJwt(token, id)).toEqual(401);
		const refreshToken = await GenerateRefreshJwt(id);
		const newToken = await askNewJwt(refreshToken, id);
		expect(newToken).toHaveProperty("token");
		expect(newToken).toHaveProperty("refreshToken");
		await new Promise((resolve) => setTimeout(async () => {
			const scdToken = await askNewJwt(refreshToken, id);
			expect(scdToken).toEqual({error: "token non valide" });
			resolve("ok");
		}, 500));
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
