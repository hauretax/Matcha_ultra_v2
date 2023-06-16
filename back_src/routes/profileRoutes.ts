import express, { Request, Response } from "express";
import { createProfile, login } from "../controllers/profileCtrl";
import asyncHandler from 'express-async-handler';

const router = express.Router();

router.post("/register", (req: Request, res: Response) => {
	console.log("call profile create");
	createProfile(req, res);
});
    
router.post("/login", asyncHandler(login))


export default router;  