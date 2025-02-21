import { validationResult } from "express-validator";
import { getMessages, createMessage } from "../database/dbQueries.js";
import formatMessages from "../utils/formatMessages.js";

export const renderFeedGet = async (req, res) => {
  const userMembership = res.locals.user?.membership || "guest";
  const messages = await getMessages();
  const formattedMessages = formatMessages(messages, userMembership);

  return res.render("feed", {
    errors: [],
    currentPage: "feed",
    messages: formattedMessages,
  });
};

export const addMessagePost = async (req, res) => {
  const errors = validationResult(req);
  const userMembership = res.locals.user?.membership || "guest";
  const messages = await getMessages();
  const formattedMessages = formatMessages(messages, userMembership);

  if (!errors.isEmpty()) {
    return res.status(400).render("feed", {
      errors: errors.array(),
      currentPage: "feed",
      messages: formattedMessages,
    });
  }

  const { newMessage } = req.body;
  const userId = res.locals.user?.id;
  if (!userId) return res.status(401).send("Unauthorized.");
  await createMessage(userId, newMessage);
  return res.redirect("/feed");
};
