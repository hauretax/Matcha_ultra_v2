import express from "express";
import { createProfile, login } from "../controllers/profileCtrl";
import asyncHandler from "express-async-handler";
import {createNewJwt} from "../controllers/jwtCtrl";


const router = express.Router();

router.post("/register", asyncHandler(createProfile)); 
router.post("/login", asyncHandler(login));
router.post("/newToken", asyncHandler(createNewJwt));
router.get("/account/validation",asyncHandler());

export default router;  