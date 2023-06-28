import express from "express";
import { createProfile, getProfile, getOptions, updateProfile, updateInterests, login, updateBio, validByEmail, insertPicture, updatePicture, deletePicture, passwordReset, RequestpasswordReset} from "../controllers/profileCtrl";
import asyncHandler from "express-async-handler";
import { createNewJwt } from "../controllers/jwtCtrl";
import { validsecurRequest, isPictureOwner } from "../middlewares/secureRequest.mid";
import upload from "../config/multer.config";

const router = express.Router();

router.post("/register", asyncHandler(createProfile));
router.post("/login", asyncHandler(login));
router.post("/newToken", asyncHandler(createNewJwt));
router.get("/profile", validsecurRequest, asyncHandler((getProfile)));
router.get("/options", validsecurRequest, asyncHandler(getOptions));
router.patch("/profile", validsecurRequest, asyncHandler(updateProfile)); // TODO: Resend mail in case mail is updated
router.patch("/profileBio", validsecurRequest, asyncHandler(updateBio));
router.patch("/profileInterests", validsecurRequest, asyncHandler(updateInterests));
router.post("/picture/new", validsecurRequest, upload.single("file"), asyncHandler(insertPicture));
router.put("/picture/:pictureId/edit", validsecurRequest, isPictureOwner, upload.single("file"), asyncHandler(updatePicture));
router.delete("/picture/:pictureId", validsecurRequest, asyncHandler(deletePicture));
router.get("/verify_email",asyncHandler(validByEmail));
router.post("/request_password_reset",asyncHandler(RequestpasswordReset));
router.post("/reset_password",asyncHandler(passwordReset));

export default router;  