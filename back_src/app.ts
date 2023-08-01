import express, { Application, Request, Response } from "express";
import path from "path";
import http from "http";
import { Server } from "socket.io";
import InitializeDb from "./database/Initialize.db";

import requestLoggerMiddleware from "./middlewares/requestLogger.middleware";
import globalErrorMiddleware from "./middlewares/globalError.middleware";
import multerErrorMiddleware from "./middlewares/multerError.middleware";
import profileRoutes from "./routes/profileRoutes";
import noteRoutes from "./routes/noteRoutes";
import { Bport } from "../comon_src/constant";

import handleSocket from "./controllers/socketCtrl";

class App {
	private app: Application;
	private server: http.Server;
	private io: Server;
	private connectedUsers: Map<string, number> = new Map<string, number>();

	constructor() {
		this.app = express();
		this.server = http.createServer(this.app);
		this.io = new Server(this.server, {
			cors: {
				origin: "http://localhost:3000",
				credentials: true
			}
		});
		this.configureMiddlewares();
		this.configureRoutes();
		this.handleErrors();
		this.configureSocket();
		//je sait pas comment faire :s
	}
	private configureSocket(): void {
		this.io.on("connection", (socket) => {
			handleSocket(socket, this.io)
			
		});
	}

	private configureMiddlewares(): void {
		//body-parser, cors, etc.
		this.app.use(function (req, res, next) {
			res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
			res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
			res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
			next();
		});
		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: true }));
		this.app.use(requestLoggerMiddleware);
		this.app.use(express.static(path.join(__dirname, "../../back_src", "public")));
	}

	private configureRoutes(): void {
		this.app.get("/", (req: Request, res: Response) => {
			res.status(200).send("Bienvenue sur le site");
		});
		this.app.use("/api", profileRoutes);
		this.app.use("/api", noteRoutes);
	}

	private handleErrors(): void {
		this.app.use(multerErrorMiddleware);
		this.app.use(globalErrorMiddleware);
	}

	public start(port: number) {
		const server = this.server.listen(port, () => {
			console.log(`Le serveur est en cours d"exécution http://localhost:${port}`);
		});
		return server;
	}
}

const app = new App();

const initFunctions = [
	InitializeDb.userTable,
	InitializeDb.pictureTable,
	InitializeDb.interestsTable,
	InitializeDb.userInterestsTable,
	InitializeDb.userNoteTable
	// ... add any additional table initializers here
];


// import insertDataInDb from "./creatTestDb";

Promise.all(initFunctions.map(initFunc => initFunc()))
	.then(() => {
		app.start(Bport);
		// generate user for test
		// insertDataInDb();
	})
	.catch(err => {
		console.error("An error occurred while initializing the tables:", err);
		process.exit(1);
	});

export default app;

