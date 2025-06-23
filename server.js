import express from "express";
import dotenv from "dotenv";
import { initDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";
import cors from "cors";
import transactionsRoute from "./routes/transactionsRoute.js";
import job from "./config/cron.js";
dotenv.config();

const app = express();

if (process.env.NODE_ENV === "production") job.start();

// middleware
app.use(cors());
app.use(express.json());
app.use(rateLimiter);
// routes middleware
app.use("/api/transactions", transactionsRoute);

// health check
app.get("/api/health", (req, res) =>
  res.status(200).json({ message: "Healthy" })
);

const PORT = process.env.PORT || 3000;
// initiate database
initDB().then(() => {
  app.listen(3000, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
