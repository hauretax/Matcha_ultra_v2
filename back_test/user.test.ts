import { createProfile, login } from "../back_src/controllers/profileCtrl";
import { Request } from "express";
import Dbhandler from "../back_src/database/DbHandler";
import { Fakexpress } from "./FackExpress";
import { UserProfile, UserReqLogin } from "../comon_src/type/user.type";
import UserDb from "../back_src/database/User.db";

const port = 3001;
const db = new Dbhandler;
const userDB = new UserDb;
const FE = new Fakexpress({
	params: {
		name: "max"
	}
});
const name = (Math.random() * 65536).toString;
const email = name+"mail1@oui.non";
const username = name+"super";
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

describe("user create Profile", () => {
	let usrId = 0;
	db.creatTables();
	// TODO
	/**
     * verification of usr in db
     */
	afterAll((done) => {
		userDB.deleteUser(usrId);
		done();
	});



	const badReq = {
		body: {
			name: "John Doe",
			email: "johndoe@example.com",
		},
	};

	const next = jest.fn();
	//test on controller
	it("should exec profileCtrl", async () => {

		await createProfile(goodReq as Request, FE.res as any);

		usrId = FE.responseData.usrId;
		expect(FE.res.status).toHaveBeenCalledWith(201);

	});
	//TODO se ne st plus un midelwar adapter le comportement en fonction
	it.skip("should return 405 if data is missing", async () => {
		// await checkDataProfilCreate(badReq as any, FE.res as any, next);

		expect(FE.res.status).toHaveBeenCalledWith(405);
		expect(next).not.toHaveBeenCalled();
	});
	//TODO se ne st plus un midelwar adapter le comportement en fonction
	it.skip("with bad password", async () => {
		// const modifiedReq = {
		// 	body: {
		// 		...goodReq.body,
		// 		password: "abcd"
		// 	},
		// };
		// await checkDataProfilCreate(modifiedReq as any, FE.res as any, next);
		expect(FE.res.status).toHaveBeenCalledWith(406);
		expect(next).not.toHaveBeenCalled();
	});
	it("with bad email", async () => {
		const modifiedReq = {
			body: {
				...goodReq.body,
				email: "abcd"
			},
		};
		await createProfile(modifiedReq as Request, FE.res as any);
		expect(FE.res.status).toHaveBeenCalledWith(406);
	});
	it("already use username", async () => {
		const modifiedReq = {
			body: {
				...goodReq.body,
				email: "abcd@test.oui"
			},
		};
		await createProfile(modifiedReq as Request, FE.res as any);
		expect(FE.res.status).toHaveBeenCalledWith(409);
	});
	it("already use email", async () => {
		const modifiedReq = {
			body: {
				...goodReq.body,
				username: "test2"
			},
		};
		await createProfile(modifiedReq as Request, FE.res as any);
		expect(FE.res.status).toHaveBeenCalledWith(409);
	});

});

const name1 = (Math.random() * 65536).toString;

const email1 = name1+"mail2@oui.non";
const username1 = name1+"supe2";

const creationReq = {
	body: {
		username:username1,
		email: email1,
		firstName,
		lastName,
		password,
	},
} as Request;
describe("user login", () => {

	db.creatTables();
	let usrId = 0;
	// TODO
	/**
     * verification of usr in db
     */
	beforeAll(async () => {
		await createProfile(creationReq, FE.res as any);
		usrId = FE.responseData.usrId;
	});

	afterAll((done) => {
		userDB.deleteUser(usrId);
		done();
	});

	//test on controller
	it("should receivd user", async () => {
		//TODO gere pour que l on puisse mettre un login
		const reqLogin = {
			body: {
				username:username1,
				password,
			}, 
		};

		await login(reqLogin as Request, FE.res as any);

		const userData: UserProfile = FE.responseData.user;
		const expectData: UserProfile = {
			email:email1,
			username:username1,
			lastName,
			firstName,
			emailVerified: false
		};

		expect(FE.res.status).toHaveBeenCalledWith(200);
		expect(userData).toEqual(expectData);
	});
});