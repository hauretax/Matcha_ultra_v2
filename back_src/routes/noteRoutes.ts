import express from "express";
import { noteUserTo } from "../controllers/noteCtrl";
import asyncHandler from "express-async-handler";
import { validsecurRequest } from "../middlewares/secureRequest.mid";

const router = express.Router();

router.post("/note/userTo", validsecurRequest, asyncHandler(noteUserTo));

export default router;  