import { Request, Response, NextFunction } from "express";

const requestLoggerMiddleware = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const start = new Date().getTime(); // Record the start time

	// Log the request information
	console.warn("NEW REQUEST =============================================>");
	console.warn(`Time: ${new Date().toISOString()}`);
	console.warn(`Route: ${req.method} ${req.originalUrl}`);
	console.warn("Request Parameters:", req.params);
	console.warn("Request Body:", req.body);

	// Continue processing the request
	next();

	// warn the response warnrmation
	res.on("finish", () => {
		const end = new Date().getTime(); // Record the end time
		const duration = end - start; // Calculate the duration

		// warn the response warnrmation
		console.warn(`Response Status: ${res.statusCode}`);
		console.warn(`Response Time: ${duration}ms`);
		// Handle error warnging
		if (res.statusCode >= 400) {
			console.warn("Error:", res.statusMessage);
		}
	});

  
};

export default requestLoggerMiddleware;
