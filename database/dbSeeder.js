import dotenv from "dotenv";
import pkg from "pg";

dotenv.config();

const { Client } = pkg;

const dropMessagesTable = "DROP TABLE IF EXISTS messages";
const dropUsersTable = "DROP TABLE IF EXISTS users";

const createUsersTable = `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    username VARCHAR(26) UNIQUE NOT NULL,
    email VARCHAR(320) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    membership VARCHAR(20) CHECK (membership IN ('basic', 'premium', 'admin')) DEFAULT 'basic',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
  );`;

const createMessagesTable = `
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
  );`;

async function seedDb() {
  console.log("Starting database seeding...");

  const client = new Client({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
  });

  try {
    await client.connect();
    console.log("Connected to database.");

    await client.query(dropMessagesTable);
    console.log("Dropped existing 'messages' table.");
    await client.query(dropUsersTable);
    console.log("Dropped existing 'users' table.");

    await client.query(createUsersTable);
    console.log("Created new 'users' table.");
    await client.query(createMessagesTable);
    console.log("Created new 'messages' table.");

    console.log("Seeding completed!");
  } catch (error) {
    console.error("Seeding failed!", error);
  } finally {
    await client.end();
    console.log("Database connection closed.");
  }
}

seedDb();
