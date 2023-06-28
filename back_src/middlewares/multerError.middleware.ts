import { NextFunction, Request, Response } from "express";
import { MulterError } from "multer";

const multerErrorMiddleware = (
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction) => {
	if (err instanceof MulterError) {
		if (err.code === "LIMIT_FILE_COUNT") {
			return res.status(400).send({ message: "No file was provided." });
		}

		if (err.code === "LIMIT_FILE_SIZE") {
			return res.status(400).send({ message: "The file is too large." });
		}

		if (err.code === "LIMIT_UNEXPECTED_FILE") {
			return res.status(400).send({ message: "The file is not a image." });
		}
	}

	// Handle other errors here
	next(err);
};

export default multerErrorMiddleware;