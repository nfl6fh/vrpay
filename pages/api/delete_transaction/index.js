import { prisma } from "../../../lib/prisma.js"
import { updateBalance } from "../../../utils.js"

// PUT /api/approve_transaction
export default async function handle(req, res) {
   const trans_id = req.body.trans_id

   var currTransaction = await prisma.transaction.findUnique({
      where: { id: trans_id },
      include: {
         user: {
            select: {
               id: true,
               total_due: true,
            },
         },
      },
   })

   // undo the transaction
   var currDue = currTransaction.user.total_due
   var currAmount = currTransaction.amount
   const due = currDue + currAmount

   const post1 = await prisma.user.update({
      where: { id: currTransaction.user.id },
      data: {
         total_due: parseFloat(due),
      },
   })

   // delete the transaction
   const deletion = await prisma.transaction.delete({
      where: { id: trans_id },
   })

   return res.json(deletion)
}
