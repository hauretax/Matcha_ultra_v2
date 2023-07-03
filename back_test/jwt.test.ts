import jwt from "jsonwebtoken";
import { generateJwt, generateRefreshJwt, askNewJwt, validateJwt } from "../back_src/utils/jwt";
import { createProfile } from "../back_src/controllers/profileCtrl";
import { Fakexpress } from "./FackExpress";
import { Request } from "express";
import InitializeDb from "../back_src/database/Initialize.db";
import DeletDb from "../back_src/database/Delet.db";

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
		InitializeDb.userTable();
		await createProfile(creationReq, FE.res as never);
		usrId = FE.responseData?.usrId || 0;
	});

	afterAll((done) => {
		DeletDb.user(usrId || 0);
		done();
	});


	it("should generate and verify a JWT", () => {
		const token = generateJwt(usrId);
		expect(typeof validateJwt(token)).toBe("number");
	});
	it("should generate and unverify a JWT", () => {
		const token = generateJwt(usrId);
		expect(validateJwt(token + "s")).toEqual(null);
	});
	//j'imite le comportement que devrais avoir le front'
	it("should refresh token", async () => {
		const token = jwt.sign({ usrId }, secretKey, { expiresIn: "1ms" });
		expect(validateJwt(token)).toEqual(null);
		const refreshToken = await generateRefreshJwt(usrId);
		const newToken = await askNewJwt(refreshToken);
		expect(newToken).toHaveProperty("token");
		expect(newToken).toHaveProperty("refreshToken");
	});
	it("should not refresh token", async () => {
		
		try {
			await askNewJwt("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsIm5vbmNlIjowLjMyMzYxNTQ0OTMyNTUxMzY3LCJpYXQiOjE2ODc3MDk1NjYsImV4cCI6MTY4ODMxNDM2Nn0.DXaSpZPJfgPcddooLwsnSe_P-0U6PpXGoPm0weDlEf4");
		} catch (error) {
			// Une erreur a été renvoyée
			expect(error).toBeInstanceOf(Error);
			expect(error.message).toBe("token not valid");
		}
	}, 10000);
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
