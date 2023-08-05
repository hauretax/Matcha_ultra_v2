import {  Request, Response } from "express";

const globalErrorMiddleware = (
	err: Error,
	req: Request,
	res: Response,
) => {
	console.log(err.stack);
	return res.status(500).send("Une erreur est survenue sur le serveur.");
};

export default globalErrorMiddleware;
