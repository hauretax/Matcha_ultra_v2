import { UserReqRegister } from "../../../comon_src/type/user.type";

export interface checkDataProfilCreate {
    code: number,
    message: string
}

export function checkDataProfilCreate(profile: UserReqRegister): checkDataProfilCreate | null {
	if (!profile)
		return { code: 405, message: "Missing required data" };
	const { username, email, firstName, lastName, password } = profile;
	const passwordRegex = /(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}/;
	const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;  

	if (!username || !email || !firstName || !lastName || !password) {
		return { code: 405, message: "Missing required data" };
	}
	if (!passwordRegex.test(password)) {
		return { code: 406, message: "password must contain at least one lowercase, one uppercase, one digit, one special character (@$!%*?&), and at least be 8 characters long" };
	}
	if (!emailRegex.test(email)) {
		return { code: 406, message: "invalid email" };
	}
	return null;
}

//TODO checkLoginData