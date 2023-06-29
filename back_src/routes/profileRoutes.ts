import express from "express";
import { createProfile, getProfile, getOptions, updateProfile, updateInterests, login, updateBio, validByEmail, insertPicture, updatePicture, deletePicture, passwordReset, RequestpasswordReset, getProfiles} from "../controllers/profileCtrl";
import asyncHandler from "express-async-handler";
import { createNewJwt } from "../controllers/jwtCtrl";
import { validsecurRequest } from "../middlewares/secureRequest.mid";
import { isPictureOwner } from "../middlewares/protectRequest.mid";
import upload from "../config/multer.config";

const router = express.Router();

router.post("/register", asyncHandler(createProfile));
router.post("/login", asyncHandler(login));
router.post("/newToken", asyncHandler(createNewJwt));
router.get("/profile", validsecurRequest, asyncHandler(getProfile));
router.get("/options", validsecurRequest, asyncHandler(getOptions));
router.patch("/profile", validsecurRequest, asyncHandler(updateProfile));
router.patch("/profileBio", validsecurRequest, asyncHandler(updateBio));
router.patch("/profileInterests", validsecurRequest, asyncHandler(updateInterests));
router.post("/picture/new", validsecurRequest, upload.single("file"), asyncHandler(insertPicture));
router.put("/picture/:pictureId/edit", validsecurRequest, isPictureOwner, upload.single("file"), asyncHandler(updatePicture));
router.delete("/picture/:pictureId", validsecurRequest, asyncHandler(deletePicture));
router.get("/verify_email",asyncHandler(validByEmail));
router.post("/request_password_reset",asyncHandler(RequestpasswordReset));
router.post("/reset_password",asyncHandler(passwordReset));
router.get("/users", validsecurRequest, asyncHandler(getProfiles));

export default router;  