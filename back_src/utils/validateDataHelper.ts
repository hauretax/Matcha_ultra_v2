import { Request } from "express";

export function validateBody(req: Request, expectedProperties: string[], expectedPropTypes: string[]): boolean {
	return expectedProperties.every(prop => Object.prototype.hasOwnProperty.call(req.body, prop) && req.body[prop] && typeof req.body[prop] === expectedPropTypes[expectedProperties.indexOf(prop)]);
}

export function validateAge(birthDate: string): boolean {
	//TODO verification date
	return true;
}

export function validateInterests(interests: string[]): boolean {
	return Array.isArray(interests) && interests.every((interest) => (typeof interest === "string" && interest != ""));
}

export function validatePictureId(pictureId: string): boolean {
	const id = parseInt(pictureId);
	return Number.isInteger(id) && id.toString() === pictureId;
}

export function validateMail(mail: string): boolean {
	const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
	return emailRegex.test(mail);
}