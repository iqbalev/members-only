import dotenv from "dotenv";
import pkg from "pg";

dotenv.config();

const { Client } = pkg;

const dropTable = "DROP TABLE IF EXISTS users";
const createTable = `
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(320) UNIQUE NOT NULL,
        password TEXT NOT NULL,
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

    await client.query(dropTable);
    console.log("Dropped existing table.");

    await client.query(createTable);
    console.log("Created a new table.");

    console.log("Seeding completed!");
  } catch (error) {
    console.error("Seeding failed!", error);
  } finally {
    await client.end();
    console.log("Database connection closed.");
  }
}

seedDb();
