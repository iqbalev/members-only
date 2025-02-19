import dbPool from "./dbPool.js";

export async function getUserUsername() {
  const { rows } = await dbPool.query("SELECT username FROM users");
  return rows;
}

export async function getUserEmail() {
  const { rows } = await dbPool.query("SELECT email FROM users");
  return rows;
}

export async function getUserById(id) {
  const { rows } = await dbPool.query("SELECT * FROM users WHERE id = $1", [
    id,
  ]);

  return rows[0];
}

export async function getUserByIdentifier(identifier) {
  const { rows } = await dbPool.query(
    "SELECT * FROM users WHERE email = $1 OR username = $1 LIMIT 1",
    [identifier]
  );

  return rows[0];
}

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
