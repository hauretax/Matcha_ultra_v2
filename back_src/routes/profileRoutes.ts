import express from "express";
import { createProfile, getProfile, getOptions, updateProfile, updateInterests, login, updateBio } from "../controllers/profileCtrl";
import asyncHandler from "express-async-handler";
import { createNewJwt } from "../controllers/jwtCtrl";
import { validsecurRequest } from "../middlewares/secureRequest.mid";


const router = express.Router();

router.post("/register", asyncHandler(createProfile));
router.post("/login", asyncHandler(login));
router.post("/newToken", asyncHandler(createNewJwt));
router.get("/profile", validsecurRequest, asyncHandler((getProfile)));
router.get("/options", validsecurRequest, asyncHandler(getOptions))
router.patch("/profile", validsecurRequest, asyncHandler(updateProfile)) // TODO: Resend mail in case mail is updated
router.patch("/profileBio", validsecurRequest, asyncHandler(updateBio))
router.patch("/profileInterests", validsecurRequest, asyncHandler(updateInterests))

export default router;  