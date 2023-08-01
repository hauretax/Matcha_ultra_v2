import express from "express";
import { createProfile, getProfile, getOptions, updateProfile, updateInterests, login, updateBio, validByEmail, insertPicture, updatePicture, deletePicture, passwordReset, RequestpasswordReset, getProfiles } from "../controllers/profileCtrl";
import asyncHandler from "express-async-handler";
import { createNewJwt } from "../controllers/jwtCtrl";
import { validsecurRequest } from "../middlewares/secureRequest.mid";
import { isPictureOwner } from "../middlewares/protectRequest.mid";
import upload from "../config/multer.config";
import axios from "axios";

const router = express.Router();
router.get("/test",async (req, res) => {
	const headers = {
		"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36"
	};
	try {
		const response = await axios.get("https://api.ip2location.io/?key=AB4DE8353DFB2A72E2650F5C872F0724&ip=62.210.33.170", { headers });
		console.log(response.data);
	} catch (error: any) {
		console.error("An error occurred:", error.message);
	}
});

router.post("/register", asyncHandler(createProfile));
router.post("/login", asyncHandler(login));
router.post("/newToken", asyncHandler(createNewJwt));
router.get("/profile", validsecurRequest, asyncHandler((getProfile)));
router.get("/options", validsecurRequest, asyncHandler(getOptions));
router.patch("/profile", validsecurRequest, asyncHandler(updateProfile));
router.patch("/profileBio", validsecurRequest, asyncHandler(updateBio));
router.patch("/profileInterests", validsecurRequest, asyncHandler(updateInterests));
router.post("/picture/new", validsecurRequest, upload.single("file"), asyncHandler(insertPicture));
router.put("/picture/:pictureId/edit", validsecurRequest, isPictureOwner, upload.single("file"), asyncHandler(updatePicture));
router.delete("/picture/:pictureId", validsecurRequest, asyncHandler(deletePicture));
router.get("/verify_email", asyncHandler(validByEmail));
router.post("/request_password_reset", asyncHandler(RequestpasswordReset));
router.post("/reset_password", asyncHandler(passwordReset));
router.get("/users", validsecurRequest, asyncHandler(getProfiles));

export default router;  