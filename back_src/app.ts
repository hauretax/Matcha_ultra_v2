import express, { Application, NextFunction } from "express";
import { Request, Response } from "express";
import profileRoutes from "./routes/profileRoutes";
import Dbhandler from "./database/DbHandler";
import { Bport } from "../comon_src/constant";
import requestLoggerMiddleware from './middlewares/requestLogger.middleware';
import globalErrorMiddleware from './middlewares/globalError.middleware'

class App {
	private app: Application;
  requestLoggerMiddleware

	constructor() {
		this.app = express();
		this.configureMiddlewares();
		this.configureRoutes();
		this.handleErrors();
		//je sait pas comment faire :s
		const db = new Dbhandler;
		db.creatTables();
	}

	private configureMiddlewares(): void {
		//body-parser, cors, etc.
		this.app.use(function (req, res, next) {
			res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
			res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
			res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
			next();
		});
		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: true }));
    this.app.use(requestLoggerMiddleware);
	}

	private configureRoutes(): void {
		this.app.get("/", (req: Request, res: Response) => {
			res.status(200).send("Bienvenue sur le site");
		});
		this.app.use("/api", profileRoutes);
	}

	private handleErrors(): void {
		this.app.use(globalErrorMiddleware);
	}

	public start(port: number) {
		const server = this.app.listen(port, () => {
			console.log(`Le serveur est en cours d"exécution http://localhost:${port}`);
		});
		return server;
	}
}

const app = new App();
app.start(Bport);

export default app;

