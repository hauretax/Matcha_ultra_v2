import express, { NextFunction, Request, Response } from "express";
// import ProfileController from "../controllers/ProfileController";
import { createProfile, login } from "../controllers/profileCtrl";

const router = express.Router();

router.post("/register", (req: Request, res: Response) => {
	console.log("call profile create");
	createProfile(req, res);
});
    
router.post("/login", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await login(req,res);
  } catch (error) {
    next(error)
  }
	
});


export default router;  