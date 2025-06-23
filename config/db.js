import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";
dotenv.config();

// create a sql
export const sql = neon(process.env.NEON_DB);

export async function initDB() {
  try {
    await sql`CREATE TABLE IF NOT EXISTS transactions (
      id SERIAL PRIMARY KEY,
      user_id VARCHAR(255) NOT NULL,
      title VARCHAR(255) NOT NULL,
      amount DECIMAL(10,2) NOT NULL,
      category VARCHAR(255) NOT NULL,
      created_at DATE NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`;
    console.log("database initialized");
  } catch (error) {
    console.log("Error Initializing the database", error);
    process.exit(1);
  }
}
