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
	const emailRegex = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/;

	if (!username || !email || !firstName || !lastName || !password) {
		return { code: 405, message: "Missing required data" };
	}
	if (!passwordRegex.test(password)) {
		return { code: 406, message: "to easy password" };
	}
	if (!emailRegex.test(email)) {
		return { code: 406, message: "don t lokk like email" };
	}
	return null;
}

//TODO checkLoginData