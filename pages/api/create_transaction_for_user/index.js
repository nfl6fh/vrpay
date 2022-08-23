import { collapseTextChangeRangesAcrossMultipleVersions } from 'typescript';
import { prisma } from '../../../lib/prisma.js';

// PUT /api/create_transaction_for_user
export default async function handle(req, res) {
    const { uid, amount, type, description } = req.body;

    console.log("uid:", uid)
    console.log("amount: ", amount)
    console.log("type: ", type)
    console.log("description: ", description)

    console.log("Creating transaction where uid:", uid, "amount: ", amount, "type: ", type, "description: ", description)
  
    // ccreate transaction
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
    });
  
    console.log("result: " + result);
    res.json(result);
  }