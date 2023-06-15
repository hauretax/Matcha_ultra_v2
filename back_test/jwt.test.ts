import jwt from "jsonwebtoken";
import { GenerateJwt, decodJwt } from "../back_src/utils/jwt";

const secretKey = process.env.JWT_SECRET;
describe("JWT Tests", () => {
	it("should generate and verify a JWT", () => {
		const token = GenerateJwt({ user: "John Doe" });
		const decoded = decodJwt(token);
		expect(decoded.user).toEqual("John Doe");
	});
	it("should include a valid signed JWT in the request header", () => {
		const payload = { user: "John Doe" };
		const token = jwt.sign(payload, secretKey);
		const req = {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		};
		const authHeader = req.headers.Authorization;
		const extractedToken = authHeader.split(" ")[1];
		const decoded = jwt.verify(extractedToken, secretKey);
		expect(decoded.user).toEqual("John Doe");
	});
});
