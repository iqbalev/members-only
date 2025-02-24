import { Router } from "express";
import secretCodeValidator from "../validators/secretCodeValidator.js";
import newMessageValidator from "../validators/newMessageValidator.js";
import {
  renderFeedGet,
  upgradeToPremiumPost,
  addMessagePost,
  deleteMessageDelete,
} from "../controllers/feedController.js";

const feedRouter = Router();

feedRouter.get("/", renderFeedGet);

feedRouter.post(
  "/upgrade-to-premium",
  secretCodeValidator,
  upgradeToPremiumPost
);

feedRouter.post("/add-message", newMessageValidator, addMessagePost);

feedRouter.delete("/:messageId/delete-message", deleteMessageDelete);

export default feedRouter;
