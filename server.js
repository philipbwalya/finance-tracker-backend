import express from "express";
import dotenv from "dotenv";
import { initDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";
import transactionsRoute from "./routes/transactionsRoute.js";
dotenv.config();

const app = express();

// middleware
app.use(express.json());
app.use(rateLimiter);
// routes middleware
app.use("/api/transactions", transactionsRoute);

const PORT = process.env.PORT || 3000;
// initiate database
initDB().then(() => {
  app.listen(3000, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
