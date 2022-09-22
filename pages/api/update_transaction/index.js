import { prisma } from "../../../lib/prisma.js";

// PUT /api/update_transaction
export default async function handle(req, res) {
  const transaction_id = req.body.transaction_id;
  const amount = req.body.amount;

  const post = await prisma.transaction.update({
    where: { id: transaction_id },
    data: {
      amount: amount,
    },
  });
  res.json(post);
}