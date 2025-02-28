import { validationResult } from "express-validator";
import {
  getMessagesCount,
  getMessages,
  createMessage,
  updateUserMembership,
  deleteMessage,
} from "../database/dbQueries.js";
import formatMessages from "../utils/formatMessages.js";
import CustomError from "../utils/CustomError.js";

export const renderFeedGet = async (req, res, next) => {
  try {
    const { user } = res.locals;
    const userMembership = user?.membership || "guest";
    const isAdmin = user?.is_admin || false;
    const messagesCount = await getMessagesCount();
    const messages = await getMessages();
    const formattedMessages = formatMessages(messages, userMembership, isAdmin);

    return res.render("feed", {
      currentPage: "feed",
      messagesCount: messagesCount,
      messages: formattedMessages,
    });
  } catch (error) {
    return next(error);
  }
};

export const addMessagePost = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { user } = res.locals;
    if (!user?.id) {
      return next(new CustomError("Unauthorized Access", 401));
    }

    const { newMessage } = req.body;
    await createMessage(user.id, newMessage);

    return res.json({ success: true });
  } catch (error) {
    return next(error);
  }
};

export const upgradeToPremiumPost = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { user } = res.locals;
    if (!user?.username) {
      return next(new CustomError("Unauthorized Access", 401));
    }

    await updateUserMembership("premium", user.username);
    return res.json({ success: true });
  } catch (error) {
    return next(error);
  }
};

export const deleteMessageDelete = async (req, res, next) => {
  try {
    const { messageId } = req.params;

    const deletedMessage = await deleteMessage(messageId);
    if (!deletedMessage) {
      return next(new CustomError("Message Not Found", 404));
    }

    return res.json({ success: true });
  } catch (error) {
    return next(error);
  }
};
