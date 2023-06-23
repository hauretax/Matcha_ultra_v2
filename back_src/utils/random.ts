export function randomString(size:number) {
	let string = "";
	const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for (let i = 0; i < size; i++) {
		const randomIndex = Math.floor(Math.random() * chars.length);
		string += chars.charAt(randomIndex);
	}

	return string;
}