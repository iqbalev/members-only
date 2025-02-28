import dbPool from "./dbPool.js";

export async function createUser(
  firstName,
  lastName,
  username,
  email,
  password
) {
  await dbPool.query(
    "INSERT INTO users (first_name, last_name, username, email, password) VALUES ($1, $2, $3, $4, $5)",
    [firstName, lastName, username, email, password]
  );
}

export async function getUsernameByUsername(username) {
  const { rows } = await dbPool.query(
    "SELECT username FROM users WHERE username = $1",
    [username]
  );

  return rows[0];
}

export async function getEmailByEmail(email) {
  const { rows } = await dbPool.query(
    "SELECT email FROM users WHERE email = $1",
    [email]
  );

  return rows[0];
}

export async function getUserById(id) {
  const { rows } = await dbPool.query("SELECT * FROM users WHERE id = $1", [
    id,
  ]);

  return rows[0];
}

export async function getUserByIdentifier(identifier) {
  const { rows } = await dbPool.query(
    "SELECT * FROM users WHERE username = $1 OR email = $1 LIMIT 1",
    [identifier]
  );

  return rows[0];
}

export async function updateUserMembership(membershipLevel, username) {
  await dbPool.query("UPDATE users SET membership = $1 WHERE username = $2", [
    membershipLevel,
    username,
  ]);
}

export async function createMessage(userId, message) {
  await dbPool.query(
    "INSERT INTO messages (user_id, message) VALUES ($1, $2)",
    [userId, message]
  );
}

export async function getMessages() {
  const { rows } = await dbPool.query(`
    SELECT users.username, messages.id, messages.user_id, messages.message, messages.created_at
    FROM messages
    JOIN users ON messages.user_id = users.id
    WHERE messages.deleted_at IS NULL
    ORDER BY messages.created_at DESC
  `);

  return rows;
}

export async function getMessagesCount() {
  const { rows } = await dbPool.query(
    "SELECT COUNT (*) FROM messages WHERE deleted_at IS NULL"
  );
  return parseInt(rows[0].count, 10);
}

export async function deleteMessage(id) {
  const { rows } = await dbPool.query(
    "UPDATE messages SET deleted_at = NOW() WHERE id = $1 RETURNING id",
    [id]
  );

  return rows.length;
}
