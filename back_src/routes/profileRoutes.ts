import express, { Request, Response } from "express";
// import ProfileController from "../controllers/ProfileController";
import { createProfile, login } from "../controllers/profileCtrl";
import { createNewJwt } from "../controllers/jwtCtrl";


const router = express.Router();

router.post("/create", (req: Request, res: Response) => {
	console.log("call profile create");
	createProfile(req, res);
});

router.post("/login", (req: Request, res: Response) => {
	login(req, res);
});

router.post("/newToken", (req: Request, res: Response) => {

	//TODO faire de la doc
	createNewJwt(req, res);
});


export default router;  