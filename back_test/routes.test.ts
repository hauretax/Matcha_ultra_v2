import request from "supertest";
import app from "../back_src/app";
import http from "http";

describe("Routes", () => {
	let server: http.Server;

	beforeAll((done) => {
		server = app.start(3000);
		done();
	});
  
	afterAll((done) => {
		server.close(() => {
			done();
		});
	});
  
	it("should return 200 OK for GET /api/profile/create", async () => {
		const response = await request(server).get("/");
		expect(response.status).toBe(200);
	});
	// Ajoutez vos autres tests de routes ici
});