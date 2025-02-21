import { validationResult } from "express-validator";
import { getMessages, createMessage } from "../database/dbQueries.js";
import formatTimestamp from "../utils/formatTimestamp.js";

export const feedGet = async (req, res) => {
  const userMembership = res.locals.user?.membership || "guest";
  const messages = await getMessages();
  const formattedMessages = messages.map((message) => {
    let username = "Member";
    let created_at = "Sometime ago...";

    if (userMembership === "premium" || userMembership === "admin") {
      username = message.username;
      created_at = formatTimestamp(message.created_at);
    }

    return { ...message, username, created_at };
  });

  return res.render("feed", {
    errors: [],
    currentPage: "feed",
    messages: formattedMessages,
  });
};

export const feedPost = async (req, res) => {
  const errors = validationResult(req);
  const userMembership = res.locals.user?.membership || "guest";
  const messages = await getMessages();
  const formattedMessages = messages.map((message) => {
    let username = "Member";
    let created_at = "Sometime ago...";

    if (userMembership === "premium" || userMembership === "admin") {
      username = message.username;
      created_at = formatTimestamp(message.created_at);
    }

    return { ...message, username, created_at };
  });

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
