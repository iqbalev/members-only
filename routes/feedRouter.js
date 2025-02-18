import { Router } from "express";
import { feedGet } from "../controllers/feedController.js";

const feedRouter = Router();

feedRouter.get("/", feedGet);

export default feedRouter;
