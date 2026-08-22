const router = require('express').Router();
const auth = require('../middleware/auth');
const Transaction = require('../models/Transaction');

// POST /api/insights/ask
router.post('/ask', auth, async (req, res) => {
    const { question } = req.body;

    if (!question || typeof question !== 'string') {
        return res.status(400).json({
            msg: 'Question is required',
        });
    }

    try {
        const normalizedQuestion = question.toLowerCase().trim();

        // Step 1: We only support "last month" questions for now.
        if (!normalizedQuestion.includes('last month')) {
            return res.status(400).json({
                msg: 'For now, please ask about spending last month.',
            });
        }

        // Step 2: Try to find the category.
        // Example:
        // "How much did I spend on food last month?"
        const categoryMatch = normalizedQuestion.match(
            /(?:on|for)\s+(.+?)\s+last month/
        );

        const category = categoryMatch
            ? categoryMatch[1].trim()
            : null;

        if (!category) {
            return res.status(400).json({
                msg: 'Please include a spending category.',
            });
        }

        // Step 3: Calculate the start and end of last month.
        const now = new Date();

        const startOfLastMonth = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            1
        );

        const startOfThisMonth = new Date(
            now.getFullYear(),
            now.getMonth(),
            1
        );

        // Step 4: Ask MongoDB to calculate the total.
        const result = await Transaction.aggregate([
            {
                $match: {
                    user: req.user,
                    type: 'expense',
                    category: {
                        $regex: new RegExp(`^${category}$`, 'i'),
                    },
                    date: {
                        $gte: startOfLastMonth,
                        $lt: startOfThisMonth,
                    },
                },
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$amount' },
                    count: { $sum: 1 },
                },
            },
        ]);

        const total = result[0]?.total || 0;
        const count = result[0]?.count || 0;

        // Step 5: Return the verified database result.
        res.json({
            question,
            data: {
                category,
                period: 'last month',
                total,
                transactionCount: count,
            },
        });
    } catch (err) {
        console.error('Insights error:', err.message);

        res.status(500).json({
            msg: 'Server error',
        });
    }
});

module.exports = router;