import { Router } from "express";
import {
  loginValidator,
  registerValidator,
} from "../validators/authValidator.js";
import {
  loginGet,
  registerGet,
  logoutPost,
  loginPost,
  registerPost,
} from "../controllers/authController.js";

const authRouter = Router();

authRouter.get("/login", loginGet);
authRouter.get("/register", registerGet);

authRouter.post("/logout", logoutPost);
authRouter.post("/login", loginValidator, loginPost);
authRouter.post("/register", registerValidator, registerPost);

export default authRouter;
