import { Router } from "express";
import newMessageValidator from "../validators/newMessageValidator.js";
import { feedGet, feedPost } from "../controllers/feedController.js";

const feedRouter = Router();

feedRouter.get("/", feedGet);

feedRouter.post("/", newMessageValidator, feedPost);

export default feedRouter;
