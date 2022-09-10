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
      const result = await prisma.transaction.create({
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
      return res.json(res)
   } else if (applyTo) {
      var uids = []

      if (applyTo === "all users") {
         uids = await prisma.user.findMany({
            where: {
               is_verified: true,
            },
         })
      } else if (applyTo === "all rookies") {
         uids = await prisma.user.findMany({
            where: {
               is_verified: true,
               is_rookie: true,
            },
         })
      } else if (applyTo === "all varsity") {
         uids = await prisma.user.findMany({
            where: {
               is_verified: true,
               is_rookie: false,
            },
         })
      } else {
         console.log("something went wrong")
         return
      }

      console.log("uids:", uids)

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

      return res.json(res)
   }

   // create transaction for all rookies
}
