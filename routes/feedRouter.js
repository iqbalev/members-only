import { Router } from "express";
import secretCodeValidator from "../validators/secretCodeValidator.js";
import newMessageValidator from "../validators/newMessageValidator.js";
import {
  renderFeedGet,
  upgradeToPremiumPost,
  addMessagePost,
} from "../controllers/feedController.js";

const feedRouter = Router();

feedRouter.get("/", renderFeedGet);

feedRouter.post(
  "/upgrade-to-premium",
  secretCodeValidator,
  upgradeToPremiumPost
);

feedRouter.post("/add-message", newMessageValidator, addMessagePost);

export default feedRouter;
