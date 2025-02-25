import formatTimestamp from "./formatTimestamp.js";

function formatMessages(messages, userMembership, isAdmin) {
  return messages.map((message) => {
    let username = "Someone";
    let createdAt = "A while ago";

    if (userMembership === "premium" || isAdmin === true) {
      username = message.username;
      createdAt = formatTimestamp(message.created_at);
    }

    return { ...message, username, createdAt };
  });
}

export default formatMessages;
