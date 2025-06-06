import { Router } from "express";
import authController from "../controllers/authController.js";

const authRouter = Router();
authRouter.post("/login", authController.login);
authRouter.post("/register", authController.register);

export default authRouter;