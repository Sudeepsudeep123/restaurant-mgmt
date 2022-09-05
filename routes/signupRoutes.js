import express from "express";
import { signupUser } from "../controllers/signup.js";

const router = express.Router();

router.post('/', signupUser)

export default router;