import { Router } from "express";
import { feedGet, feedPost } from "../controllers/feedController.js";

const feedRouter = Router();

feedRouter.get("/", feedGet);

feedRouter.post("/", feedPost);

export default feedRouter;
