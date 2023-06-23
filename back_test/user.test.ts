import { createProfile, login } from "../back_src/controllers/profileCtrl";
import { Request } from "express";

import { Fakexpress } from "./FackExpress";
import { UserProfile, UserReqRegister } from "../comon_src/type/user.type";

import { checkDataProfilCreate } from "../back_src/controllers/dataVerifiers/assertedUserData";
import UserDb from "../back_src/database/User.db";

const FE = new Fakexpress();
const name = (Math.random() * 65536).toString();
const email = name + "cihipir849@anomgo.com";
const username = name + "super";
const firstName = "eude";
const lastName = "marcel";
const password = "opPsw1@s";

const goodReq = {
	body: {
		username,
		email,
		firstName,
		lastName,
		password,
	},
} as Request;


//TODO test mailler
describe("user create Profile", () => {
	let usrId: number | undefined = 0;
	UserDb.initializeUserTable();

	afterAll((done) => {
		UserDb.deleteUser(usrId || 0);
		done();
	});

	//test on controller
	it("should exec profileCtrl", async () => {
		
		await createProfile(goodReq as Request, FE.res as never);
		// await sleep(10000);

		expect(FE.res.status).toHaveBeenCalledWith(201);
		usrId = FE.responseData?.usrId;
	},60000);

	it("should return 405 if data is missing", async () => {
		const wrongUser = goodReq.body;
		wrongUser["email"] = "";
		const result = checkDataProfilCreate(wrongUser as UserReqRegister);
		expect(result?.code).toEqual(405);
	});
	it("with bad password", async () => {
		const modifiedReq = {
			body: {
				...goodReq.body,
				password: "abcd",
				email
			},
		};
		const result = checkDataProfilCreate(modifiedReq.body as UserReqRegister);
		expect(result?.code).toEqual(406);
	});
	it("with bad email", async () => {
		const modifiedReq = {
			body: {
				...goodReq.body,
				email: "abcd"
			},
		};
		const result = checkDataProfilCreate(modifiedReq.body as UserReqRegister);
		expect(result?.code).toEqual(406);
	});
	it("already use username", async () => {
		const modifiedReq = {
			body: {
				...goodReq.body,
				email: "abcd@test.oui"
			},
		};
		await createProfile(modifiedReq as Request, FE.res as never);
		expect(FE.res.status).toHaveBeenCalledWith(409);
	});
	it("already use email", async () => {
		const modifiedReq = {
			body: {
				...goodReq.body,
				username: "test2"
			},
		};
		await createProfile(modifiedReq as Request, FE.res as never);
		expect(FE.res.status).toHaveBeenCalledWith(409);
	});

});

const name1 = (Math.random() * 65536).toString();

const email1 = name1 + "mail2@oui.non";
const username1 = name1 + "supe2";

const creationReq = {
	body: {
		username: username1,
		email: email1,
		firstName,
		lastName,
		password,
	},
} as Request;
describe("user login", () => {

	UserDb.initializeUserTable();
	let usrId: number | undefined = 0;
	// TODO
	/**
	 * verification of usr in db
	 */
	beforeAll(async () => {
		await createProfile(creationReq, FE.res as never);
		usrId = FE.responseData?.usrId;
	});

	afterAll((done) => {
		UserDb.deleteUser(usrId || 0);
		done();
	});

	//test on controller
	it("should receivd user", async () => {
		const reqLogin = {
			body: {
				username: username1,
				password,
			},
		};

		await login(reqLogin as Request, FE.res as never);
		const expectData: UserProfile = {
			email: email1,
			username: username1,
			lastName,
			firstName,
			emailVerified: 0,
			id: usrId || 0
		};
		expect(FE.res.status).toHaveBeenCalledWith(200);
		expect(FE.responseData?.profile).toEqual(expectData);
		const newToken = FE.responseData?.jwtToken;
		expect(newToken).toHaveProperty("token");
		expect(newToken).toHaveProperty("refreshToken");
	});
});