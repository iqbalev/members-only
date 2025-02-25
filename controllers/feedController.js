import { validationResult } from "express-validator";
import {
  getMessagesCount,
  getMessages,
  createMessage,
  updateUserMembership,
  deleteMessage,
} from "../database/dbQueries.js";
import formatMessages from "../utils/formatMessages.js";

export const renderFeedGet = async (req, res) => {
  const userMembership = res.locals.user?.membership || "guest";
  const isAdmin = res.locals.user?.is_admin || false;
  const messagesCount = await getMessagesCount();
  const messages = await getMessages();
  const formattedMessages = formatMessages(messages, userMembership, isAdmin);

  return res.render("feed", {
    currentPage: "feed",
    messagesCount: messagesCount,
    messages: formattedMessages,
  });
};

export const addMessagePost = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const userId = res.locals.user?.id;
  const { newMessage } = req.body;
  if (!userId) return res.status(401).json("Unauthorized.");
  await createMessage(userId, newMessage);

  return res.json({ success: true });
};

export const upgradeToPremiumPost = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const userUsername = res.locals.user.username;
  await updateUserMembership("premium", userUsername);

  return res.json({ success: true });
};

export const deleteMessageDelete = async (req, res) => {
  const { messageId } = req.params;
  const deletedMessage = await deleteMessage(messageId);

  if (!deletedMessage) {
    return res.status(404).json({ error: "Message not found." });
  }

  return res.json({ success: true });
};
