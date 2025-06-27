const express = require('express')
const router = express.Router();
const { ExpenseModel } = require('./db');

const { auth } = require('./auth');
const z = require('zod');




router.post('/', auth, async function(req, res) {
    const requireBody = z.object({
        expense: z.string().min(5),
        expenseType: z.boolean(),
        amount: z.number(),
        reason: z.string()
    })
    const parsedData = requireBody.safeParse(req.body);

    if (!parsedData.success) {
        return res.status(400).json({
            message: "Invalid input format",
            errors: parsedData.error.errors.map(e => e.message)
        });
    }

    const { expense, expenseType, amount, reason } = parsedData.data;
    try {
        await ExpenseModel.create({
            expense,
            expenseType,
            reason,
            amount,
            userId: req.userId
        })
        res.status(200).json({ message: "success" });
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: "oops unable to add expense" });
    }
})
router.get('/', auth, async function(req, res) {
    const expense = req.query.expense;
    if (!expense) {
        return res.status(400).json({ message: "expense query param missing" });
    }
    try {
        const foundExpense = await ExpenseModel.find({
            expense: expense,
            userId: req.userId
        })
        if (foundExpense && foundExpense.length > 0) {
            res.json({
                expense: foundExpense
            });
        } else {
            res.status(404).json({ message: "not found" })
        }
    } catch (error) {
        res.status(400).json({
            message: "Invalid input",
            error: error.message
        });
    }
})
router.delete('/', auth, async function(req, res) {
    const { expense } = req.body;

    if (!expense) {
        return res.status(400).json({ message: "Missing expense name" });
    }

    try {
        const deleted = await ExpenseModel.findOneAndDelete({
            expense: expense,
            userId: req.userId
        });

        if (deleted) {
            return res.status(200).json({ message: "Successfully deleted" });
        } else {
            return res.status(404).json({
                message: "Expense not found or you don't have permission to delete it"
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error while deleting expense" });
    }
});




module.exports = router;