import { prisma } from '../../../lib/prisma.js';

// PUT /api/update_balance
export default async function handle(req, res) {
    const { uid, amount } = req.body

    const post1 = await prisma.user.update({
        where: { id: uid },
        data: {
            total_due: parseFloat(amount)
        },
    });
    // console.log(currTransaction.user.total_due)
    res.json(post1);
}