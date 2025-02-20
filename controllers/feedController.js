import formatTimestamp from "../utils/formatTimestamp.js";
import { getMessages, createMessage } from "../database/dbQueries.js";

export const feedGet = async (req, res) => {
  const userMembership = res.locals.user?.membership || "guest";
  const messages = await getMessages();
  const messagesWithFormattedTimestamp = messages.map((message) => {
    let username = "Member";
    let created_at = "Sometime ago...";

    if (userMembership === "premium" || userMembership === "admin") {
      username = message.username;
      created_at = formatTimestamp(message.created_at);
    }

    return { ...message, username, created_at };
  });

  return res.render("feed", {
    currentPage: "feed",
    messages: messagesWithFormattedTimestamp,
  });
};

export const feedPost = async (req, res) => {
  const { newMessage } = req.body;
  const userId = res.locals.user?.id;
  if (!userId) return res.status(401).send("Unauthorized.");
  await createMessage(userId, newMessage);
  return res.redirect("/feed");
};
