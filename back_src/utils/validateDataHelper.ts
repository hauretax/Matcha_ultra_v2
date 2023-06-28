import { Request } from 'express';

export function validateBody(req: Request, expectedProperties: string[], expectedPropTypes: string[]): boolean {
  return expectedProperties.every(prop => req.body.hasOwnProperty(prop) && req.body[prop] && typeof req.body[prop] === expectedPropTypes[expectedProperties.indexOf(prop)]);
}

export function validateAge(age: number): boolean {
  return Number.isInteger(age) && age >= 18 && age <= 120;
}

export function validateInterests(interests: string[]): boolean {
  return Array.isArray(interests) && interests.every((interest: any) => (typeof interest === 'string' && interest != ''));
}

export function validatePictureId(pictureId: string): boolean {
  const id = parseInt(pictureId);
  return Number.isInteger(id) && id.toString() === pictureId;
}

export function validateMail(mail: string): boolean {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  return emailRegex.test(mail);
}