import { Request, Response, NextFunction } from "express";

const requestLoggerMiddleware = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const start = new Date().getTime(); // Record the start time

	// Log the request information
	console.log("NEW REQUEST =============================================>");
	console.log(`Time: ${new Date().toISOString()}`);
	console.log(`Route: ${req.method} ${req.originalUrl}`);
	console.log("Request Parameters:", req.params);
	console.log("Request Body:", req.body);

	// Continue processing the request
	next();

	// Log the response information
	res.on("finish", () => {
		const end = new Date().getTime(); // Record the end time
		const duration = end - start; // Calculate the duration

		// Log the response information
		console.log(`Response Status: ${res.statusCode}`);
		console.log(`Response Time: ${duration}ms`);
		// Handle error logging
		if (res.statusCode >= 400) {
			console.log("Error:", res.statusMessage);
		}
	});

  
};

export default requestLoggerMiddleware;
