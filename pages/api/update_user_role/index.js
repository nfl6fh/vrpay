import { prisma } from "../../../lib/prisma.js"

// PUT /api/verify_user
export default async function handle(req, res) {
   const user_id = req.body.uid
   const role = req.body.role

   console.log("user_id: " + user_id)
   console.log("role: " + role)

   if (role === "rookie") {
      const response = await prisma.user
         .update({
            where: { id: user_id },
            data: {
               is_rookie: true,
            },
         })
         .then((res) => {
            return res
         })

         return res.json(response)
   }
   //    else if (role == "coach") {
   //       const post = await prisma.user.update({
   //          where: { id: user_id },
   //          data: {
   //             role: "admin",
   //             is_rookie: false,
   //          },
   //       })
   //    }
   else {
      // is varsity athlete
      const response = await prisma.user
         .update({
            where: { id: user_id },
            data: {
               is_rookie: false,
            },
         })
         .then((res) => {
            return res
         })

        return res.json(response)
   }

   
}
