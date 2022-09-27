import { prisma } from "../../../lib/prisma.js";

// PUT /api/update_transaction
export default async function handle(req, res) {
  const transaction_id = req.body.transaction_id;
  const amount = req.body.amount;

  var curr_transaction = await prisma.transaction.findUnique({
    where: { id: transaction_id },
    include: {
      user: {
        select: {
          id: true,
          total_due: true,
        }
      },
    }
  });

  if (curr_transaction.status === "approved") {
    var currDue = curr_transaction.user.total_due
    var currAmount = curr_transaction.amount
    const due = currDue + (currAmount - amount)

    const post1 = await prisma.user.update({
       where: { id: curr_transaction.user.id },
       data: {
          total_due: parseFloat(due),
       },
    })
  }


  const post = await prisma.transaction.update({
    where: { id: transaction_id },
    data: {
      amount: amount,
    },
  });
  res.json(post);
}