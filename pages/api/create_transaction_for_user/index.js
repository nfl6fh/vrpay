import { collapseTextChangeRangesAcrossMultipleVersions } from "typescript"
import { prisma } from "../../../lib/prisma.js"
import { updateBalance } from "../../../utils.js"

// PUT /api/create_transaction_for_user
export default async function handle(req, res) {
   const { uid, amount, type, description, applyTo } = req.body

   console.log("uid:", uid)
   console.log("amount:", amount)
   console.log("type:", type)
   console.log("description:", description)
   console.log("applyTo:", applyTo)

   // create transaction for single user
   if (applyTo == "na") {
      const result = await prisma.user.findMany({
         data: {
            user: {
               connect: {
                  id: uid,
               },
            },
            amount: parseInt(amount),
            type: type,
            description: description,
         },
      })
   } else if (applyTo == "all users") {
      const uids = await prisma.user.findMany({
         where: {
            is_verified: true,
         },
      })

      for (const user of uids) {
         const result = await prisma.transaction.create({
            data: {
               user: {
                  connect: {
                     id: user.id,
                  },
               },
               amount: parseInt(amount),
               type: type,
               description: description,
               status: "approved",
            },
         })
         console.log("result: " + result)

         var currDue = user.total_due
         var currAmount = amount
         const due = currDue - currAmount

         console.log("Planning on updating balance for user: " + user.id)
         console.log("with balance: " + due)

         // updateBalance(user.id, due)
         const post1 = await prisma.user.update({
            where: { id: user.id },
            data: {
               total_due: parseFloat(due),
            },
         })
      }

      return result
   } else if (applyTo == "all rookies") {
   }

   // create transaction for all rookies
}
