import express from "express";
import { createProfile, getProfile, updateProfile, login, validByEmail } from "../controllers/profileCtrl";
import asyncHandler from "express-async-handler";
import { createNewJwt } from "../controllers/jwtCtrl";
import { validsecurRequest } from "../middlewares/secureRequest.mid";


const router = express.Router();

router.post("/register", asyncHandler(createProfile));
router.post("/login", asyncHandler(login));
router.post("/newToken", asyncHandler(createNewJwt));
router.get("/profile", validsecurRequest, asyncHandler((getProfile)));
router.patch("/profile", validsecurRequest, asyncHandler(updateProfile))
router.get("/verify_email",asyncHandler(validByEmail));

export default router;  