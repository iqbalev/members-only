import { Router } from "express";
import newMessageValidator from "../validators/newMessageValidator.js";
import {
  renderFeedGet,
  addMessagePost,
} from "../controllers/feedController.js";

const feedRouter = Router();

feedRouter.get("/", renderFeedGet);

feedRouter.post("/add-message", newMessageValidator, addMessagePost);

export default feedRouter;
