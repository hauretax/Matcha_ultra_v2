import jwt from "jsonwebtoken";
import { generateJwt, GenerateRefreshJwt, askNewJwt, validateJwt } from "../back_src/utils/jwt";
import UserDb from "../back_src/database/User.db";
import { createProfile } from "../back_src/controllers/profileCtrl";
import { Fakexpress } from "./FackExpress";
import { Request } from "express";
import { sleep } from "./utils";

const FE = new Fakexpress();
const secretKey = process.env.JWT_SECRET;
const firstName = "eude";
const lastName = "marcel";
const password = "opPsw1@s";
// const db = new Dbhandler;

const name = (Math.random() * 65536).toString();

const email = name + "mail2@oui.non";
const username = name + "supe2";

const creationReq = {
	body: {
		username: username,
		email: email,
		firstName,
		lastName,
		password,
	},
} as Request;


if (!secretKey) {
	throw (".env look broken");
}

describe("JWT Tests", () => {

	let usrId: number;
	// TODO
	/**
	 * verification of usr in db
	 */
	beforeAll(async () => {
		UserDb.initializeUserTable();
		await createProfile(creationReq, FE.res as never);
		usrId = FE.responseData?.usrId || 0;
	});

	afterAll((done) => {
		UserDb.deleteUser(usrId || 0);
		done();
	});


	it("should generate and verify a JWT", () => {
		const token = generateJwt(usrId);
		expect(validateJwt(token, usrId)).toEqual(true);
	});
	it("should generate and unverify a JWT", () => {
		const token = generateJwt(usrId);
		expect(validateJwt(token, usrId + 1)).toEqual(false);
	});
	//j'imite le comportement que devrais avoir le front'
	it("should be expire and aske new token", async () => {
		const token = jwt.sign({ usrId }, secretKey, { expiresIn: "1ms" });

		expect(validateJwt(token, usrId)).toEqual(401);
		const refreshToken = await GenerateRefreshJwt(usrId);
		await sleep(500);
		const newToken = await askNewJwt(refreshToken, usrId);
		expect(newToken).toHaveProperty("token");
		expect(newToken).toHaveProperty("refreshToken");
		await new Promise((resolve) => setTimeout(async () => {
			const scdToken = await askNewJwt(refreshToken, usrId);
			expect(scdToken).toEqual({ error: "token non valide" });
			resolve("ok");
		}, 500));
	},10000);
	it("should include a valid signed JWT in the request header", () => {
		const payload = { usrId };
		const token = jwt.sign(payload, secretKey);
		const req = {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		};
		const authHeader = req.headers.Authorization;
		const extractedToken = authHeader.split(" ")[1];
		const decoded = jwt.verify(extractedToken, secretKey) as jwt.JwtPayload;
		expect(decoded.usrId).toEqual(usrId);
	});
});
