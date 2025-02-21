import formatTimestamp from "./formatTimestamp.js";

function formatMessages(messages, userMembership) {
  return messages.map((message) => {
    let username = "Member";
    let createdAt = "Sometime ago...";

    if (userMembership === "premium" || userMembership === "admin") {
      username = message.username;
      createdAt = formatTimestamp(message.created_at);
    }

    return { ...message, username, createdAt };
  });
}

export default formatMessages;
