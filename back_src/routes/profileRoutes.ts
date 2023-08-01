import express from "express";
import { createProfile, getProfile, getOptions, updateProfile, updateInterests, login, updateBio, validByEmail, insertPicture, updatePicture, deletePicture, passwordReset, RequestpasswordReset, getProfiles } from "../controllers/profileCtrl";
import asyncHandler from "express-async-handler";
import { createNewJwt } from "../controllers/jwtCtrl";
import { validsecurRequest } from "../middlewares/secureRequest.mid";
import { isProfileCompleted, isPictureOwner } from "../middlewares/protectRequest.mid";
import setUserPosition from  "../controllers/localisationCtrl"
import upload from "../config/multer.config";
import axios from "axios";

const router = express.Router();
const publicGroup = [];
const privateGroup = [validsecurRequest];
const pictureOwnerGroup = [validsecurRequest, isPictureOwner];
const profileCompletedGroup = [validsecurRequest, isProfileCompleted];

router.post("/register", publicGroup, asyncHandler(createProfile));
router.post("/login", publicGroup, asyncHandler(login));
router.get("/verify_email", publicGroup, asyncHandler(validByEmail));
router.post("/request_password_reset", publicGroup, asyncHandler(RequestpasswordReset));
router.post("/reset_password", publicGroup, asyncHandler(passwordReset));
router.post("/newToken", publicGroup, asyncHandler(createNewJwt));

router.post("/setLocalisation", privateGroup, asyncHandler(setUserPosition));
router.get("/profile", privateGroup, asyncHandler(getProfile));
router.get("/options", privateGroup, asyncHandler(getOptions));
router.patch("/profile", privateGroup, asyncHandler(updateProfile));
router.patch("/profileBio", privateGroup, asyncHandler(updateBio));
router.patch("/profileInterests", privateGroup, asyncHandler(updateInterests));
router.post("/picture/new", privateGroup, upload.single("file"), asyncHandler(insertPicture));

router.put("/picture/:pictureId/edit", pictureOwnerGroup, upload.single("file"), asyncHandler(updatePicture));
router.delete("/picture/:pictureId", pictureOwnerGroup, asyncHandler(deletePicture));

router.get("/users", validsecurRequest, profileCompletedGroup, asyncHandler(getProfiles));

export default router;  
