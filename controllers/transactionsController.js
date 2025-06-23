import { sql } from "../config/db.js";

export async function getTransactionsById(req, res) {
  try {
    // get user id from clerk
    const { user_id } = req.params;
    const transactions =
      await sql`SELECT * FROM transactions WHERE user_id = ${user_id}`;
    return res.status(200).json(transactions);
  } catch (error) {
    console.log("Error fetching transactions", error);
    return res.status(500).json({ message: "Error fetching transactions" });
  }
}
export async function getSummaryById(req, res) {
  try {
    const { user_id } = req.params;
    const balanceResult = await sql`
        SELECT COALESCE(SUM(amount), 0) AS balance
        FROM transactions
        WHERE user_id = ${user_id}`;
    const incomeResult = await sql`
        SELECT COALESCE(SUM(amount), 0) AS income
        FROM transactions
        WHERE user_id = ${user_id} AND amount > 0`;
    const expenseResult = await sql`
        SELECT COALESCE(SUM(amount), 0) AS expense
        FROM transactions
        WHERE user_id = ${user_id} AND amount < 0`;
    return res.status(200).json({
      balance: balanceResult[0].balance,
      income: incomeResult[0].income,
      expense: expenseResult[0].expense,
    });
  } catch (error) {
    console.log("Error fetching transactions", error);
    return res.status(500).json({ message: "Error fetching transactions" });
  }
}
export async function postTransactions(req, res) {
  try {
    const { title, amount, category, user_id } = req.body;
    if (!title || amount === undefined || !category || !user_id) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const transaction =
      await sql`INSERT INTO transactions (title,amount,category,user_id) VALUES (${title},${amount},${category},${user_id}) RETURNING *`;

    if (!transaction) {
      return res.status(500).json({ message: "Error creating transaction" });
    }

    return res
      .status(201)
      .json({ message: "Transaction created successfully" });
  } catch (error) {
    console.log("Error creating transaction", error);
    return res.status(500).json({ message: "Error creating transaction" });
  }
}
export async function deleteTransactionsById(req, res) {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({ message: "Invalid Transaction ID" });
    }
    const transaction =
      await sql`DELETE FROM transactions WHERE id = ${id} RETURNING *`;
    if (transaction.length === 0) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    return res
      .status(200)
      .json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.log("Error deleting transaction", error);
    return res.status(500).json({ message: "Error deleting transaction" });
  }
}
