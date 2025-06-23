import express from "express";
import {
  deleteTransactionsById,
  getSummaryById,
  getTransactionsById,
  postTransactions,
} from "../controllers/transactionsController.js";

const router = express.Router();

router.get("/:user_id", getTransactionsById);

router.get("/summary/:user_id", getSummaryById);

router.post("/", postTransactions);
router.delete("/:id", deleteTransactionsById);

export default router;
