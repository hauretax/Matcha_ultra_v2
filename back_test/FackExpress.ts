import { Response } from "express";
import { UserProfile } from "../comon_src/type/user.type";
import { newJwt } from "../comon_src/type/jwt.type";

export interface CustomRespons {
	usrId?: number
	profile?: UserProfile
	error?: string
	jwtToken?: newJwt
  }

export class Fakexpress {

	res : Partial<Response> = {
		statusCode: 200,
		status: jest.fn().mockImplementation((code) => {
			this.res.statusCode = code;
			return this.res;
		}),
		json: jest.fn().mockImplementation((param) => {
			this.responseData = param;
			return this.res;
		}),
		send: jest.fn(),
		cookie: jest.fn(),
		clearCookie: jest.fn()
	};

	req: Request;
	responseData: CustomRespons;
}