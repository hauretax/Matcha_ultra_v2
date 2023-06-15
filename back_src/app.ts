import express, { Application, NextFunction } from "express";
import { Request, Response } from "express";
import profileRoutes from "./routes/profileRoutes";
import Dbhandler from "./database/DbHandler";

class App {
	private app: Application;


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
		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: true }));
	}

	private configureRoutes(): void {
		this.app.get("/", (req: Request, res: Response) => {
			res.status(200).send("Bienvenue sur le site");
		});
		this.app.use("/api", profileRoutes);
	}

	private handleErrors(): void {
		this.app.use((err: Error, req: Request, res: Response) => {
			console.log(err.stack);
			res.status(500).send("Une erreur est survenue sur le serveur.");
		});
	}

	public start(port: number){
		const  server  = this.app.listen(port, () => {
			console.log(`Le serveur est en cours d"exécution http://localhost:${port}`);
		});
		return server;
	}
}

// Utilisation de la classe App
const app = new App();
const port = 3042; // Choisissez le port que vous souhaitez utiliser
app.start(port);

export default app;

