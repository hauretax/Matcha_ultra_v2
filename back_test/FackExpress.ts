import { Response } from "express";

export class Fakexpress {

	constructor(req: any) {
		this.req = req;
	}

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
	responseData: any;
}