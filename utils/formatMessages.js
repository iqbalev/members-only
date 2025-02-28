import formatTimestamp from "./formatTimestamp.js";

function formatMessages(messages, userMembership, isAdmin) {
  return messages.map((message) => {
    let userId = message.user_id;
    let username = "Someone";
    let createdAt = "A while ago";

    if (userMembership === "premium" || isAdmin === true) {
      username = message.username;
      createdAt = formatTimestamp(message.created_at);
    }

    return { ...message, userId, username, createdAt };
  });
}

export default formatMessages;
