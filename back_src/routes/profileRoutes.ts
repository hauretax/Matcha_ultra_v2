import express from "express";
import { createProfile, getProfile, updateProfile, login, updateBio } from "../controllers/profileCtrl";
import asyncHandler from "express-async-handler";
import { createNewJwt } from "../controllers/jwtCtrl";
import { validsecurRequest } from "../middlewares/secureRequest.mid";


const router = express.Router();

router.post("/register", asyncHandler(createProfile));
router.post("/login", asyncHandler(login));
router.post("/newToken", asyncHandler(createNewJwt));
router.get("/profile", validsecurRequest, asyncHandler((getProfile)));
router.patch("/profile", validsecurRequest, asyncHandler(updateProfile))
router.patch("/profileBio", validsecurRequest, asyncHandler(updateBio))

export default router;  