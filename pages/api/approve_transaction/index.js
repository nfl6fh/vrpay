import { prisma } from '../../../lib/prisma.js';

// PUT /api/approve_transaction
export default async function handle(req, res) {
    const trans_id = req.body.trans_id

    const post = await prisma.transaction.update({
        where: { id: trans_id },
        data: {
            status: "approved"
        },
    });

    var currTransaction = await prisma.transaction.findUnique({
        where: { id: trans_id},
        include: {
            user: {
                select: {
                    id: true,
                    total_due: true
                }
            }
        },
    });

    // console.log(currTransaction.id)
    var currDue = currTransaction.user.total_due
    var currAmount = currTransaction.amount
    const due = currDue - currAmount
    console.log(currDue)
    const post1 = await prisma.user.update({
        where: { id: currTransaction.user.id},
        data: {
            total_due: parseFloat(due)
        },
    });
    // console.log(currTransaction.user.total_due)
    res.json(post1);
}