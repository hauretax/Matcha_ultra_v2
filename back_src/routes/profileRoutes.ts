import express from "express";

import { createProfile, getProfile, getOptions, updateProfile, updateInterests, login, updateBio, validByEmail, insertPicture, updatePicture, deletePicture, passwordReset, RequestpasswordReset, getProfiles, getProfileById, like, viewProfile, block, report, getProfileLikesCtrl, getProfileVisitsCtrl } from "../controllers/profileCtrl";
import { getActualConversations, getChat, newMessage } from "../controllers/chatCtrl";

import asyncHandler from "express-async-handler";
import { createNewJwt } from "../controllers/jwtCtrl";
import { validsecurRequest } from "../middlewares/secureRequest.mid";
import { isProfileCompleted, isPictureOwner } from "../middlewares/protectRequest.mid";
import { setUserPosition, setUserPositionByIP } from "../controllers/localisationCtrl";
import upload from "../config/multer.config";
import { getNotification, seeNotification } from "../controllers/notificationCtrl";

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
router.post("/chat/new", profileCompletedGroup, asyncHandler(newMessage));

router.post("/setLocalisation", privateGroup, asyncHandler(setUserPosition));
router.post("/setLocationByIP", privateGroup, asyncHandler(setUserPositionByIP));
router.get("/profile", privateGroup, asyncHandler(getProfile));
router.get("/profile/likes", privateGroup, asyncHandler(getProfileLikesCtrl));
router.get("/profile/visits", privateGroup, asyncHandler(getProfileVisitsCtrl));
router.get("/options", privateGroup, asyncHandler(getOptions));
router.patch("/profile", privateGroup, asyncHandler(updateProfile));
router.patch("/profileBio", privateGroup, asyncHandler(updateBio));
router.patch("/profileInterests", privateGroup, asyncHandler(updateInterests));
router.post("/picture/new", privateGroup, upload.single("file"), asyncHandler(insertPicture));
router.post("/view", privateGroup, asyncHandler(viewProfile));
router.post("/seeNotification", privateGroup, asyncHandler(seeNotification));
router.post("/block", privateGroup, asyncHandler(block));
router.post("/report", privateGroup, asyncHandler(report));

router.put("/picture/:pictureId/edit", pictureOwnerGroup, upload.single("file"), asyncHandler(updatePicture));
router.delete("/picture/:pictureId", pictureOwnerGroup, asyncHandler(deletePicture));

router.get("/users", validsecurRequest, profileCompletedGroup, asyncHandler(getProfiles));
router.post("/like", profileCompletedGroup, asyncHandler(like));
router.get("/getnotification", privateGroup, asyncHandler(getNotification));
router.get("/profile/:id", profileCompletedGroup, asyncHandler(getProfileById));
router.get("/chat/getConv", profileCompletedGroup, asyncHandler(getActualConversations));
router.get("/chat/getChat/:id", profileCompletedGroup, asyncHandler(getChat));

export default router;  
