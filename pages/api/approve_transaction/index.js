import { prisma } from "../../../lib/prisma.js"
import { updateBalance } from "../../../utils.js"

// PUT /api/approve_transaction
export default async function handle(req, res) {
   const trans_id = req.body.trans_id
   const sessionName = req.body.sessionName

   const post = await prisma.transaction.update({
      where: { id: trans_id },
      data: {
         status: "approved",
         approvedBy: sessionName
      },
   })

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

   // console.log(currTransaction.id)
   var currDue = currTransaction.user.total_due
   var currAmount = currTransaction.amount
   const due = currDue - currAmount

   const post1 = await prisma.user.update({
      where: { id: currTransaction.user.id },
      data: {
         total_due: parseFloat(due),
      },
   })

   return res.json(post)
}
