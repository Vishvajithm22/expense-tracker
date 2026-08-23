const router = require('express').Router();
const auth = require('../middleware/auth');
const Transaction = require('../models/Transaction');
const {
    generateInsightAnswer,
} = require('../services/groq');

// Escape special characters before using a value inside RegExp
function escapeRegex(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Get the start and end dates for a month
function getMonthRange(offset = 0) {
    const now = new Date();

    const start = new Date(
        now.getFullYear(),
        now.getMonth() + offset,
        1
    );

    const end = new Date(
        now.getFullYear(),
        now.getMonth() + offset + 1,
        1
    );

    return { start, end };
}

// Extract category from questions such as:
// "How much did I spend on food last month?"
function getCategory(question) {
    const match = question.match(
        /(?:on|for)\s+(.+?)(?:\s+this month|\s+last month|\?|$)/i
    );

    return match ? match[1].trim() : null;
}

// Ask Groq to phrase the already-calculated result.
// If Groq fails, return a fallback state instead of breaking the API.
async function addAIAnswer(question, data) {
    try {
        const answer = await generateInsightAnswer(
            question,
            data
        );

        return {
            answer,
            aiGenerated: true,
        };
    } catch (error) {
        console.error(
            'Groq error:',
            error.message
        );

        return {
            answer: null,
            aiGenerated: false,
        };
    }
}

// POST /api/insights/ask
router.post('/ask', auth, async (req, res) => {
    const { question } = req.body;

    if (!question || typeof question !== 'string') {
        return res.status(400).json({
            msg: 'Question is required',
        });
    }

    try {
        const normalized = question.toLowerCase().trim();

        // ==================================================
        // 1. SPENDING LAST MONTH
        //
        // Examples:
        // "How much did I spend last month?"
        // "How much did I spend on food last month?"
        // ==================================================

        if (
            normalized.includes('spend') &&
            normalized.includes('last month')
        ) {
            const category = getCategory(normalized);
            const { start, end } = getMonthRange(-1);

            const match = {
                user: req.user,
                type: 'expense',
                date: {
                    $gte: start,
                    $lt: end,
                },
            };

            if (category) {
                match.category = {
                    $regex: new RegExp(
                        `^${escapeRegex(category)}$`,
                        'i'
                    ),
                };
            }

            const result = await Transaction.aggregate([
                {
                    $match: match,
                },
                {
                    $group: {
                        _id: null,
                        total: {
                            $sum: '$amount',
                        },
                        transactionCount: {
                            $sum: 1,
                        },
                    },
                },
            ]);

            const data = {
                category,
                period: 'last month',
                total: result[0]?.total || 0,
                transactionCount:
                    result[0]?.transactionCount || 0,
            };

            const aiResult = await addAIAnswer(
                question,
                data
            );

            return res.json({
                intent: category
                    ? 'category_total'
                    : 'period_total',

                question,

                data,

                answer: aiResult.answer,

                aiGenerated:
                    aiResult.aiGenerated,
            });
        }

        // ==================================================
        // 2. SPENDING THIS MONTH
        //
        // Examples:
        // "How much did I spend this month?"
        // "How much did I spend on food this month?"
        // ==================================================

        if (
            normalized.includes('spend') &&
            normalized.includes('this month')
        ) {
            const category = getCategory(normalized);
            const { start, end } = getMonthRange(0);

            const match = {
                user: req.user,
                type: 'expense',
                date: {
                    $gte: start,
                    $lt: end,
                },
            };

            if (category) {
                match.category = {
                    $regex: new RegExp(
                        `^${escapeRegex(category)}$`,
                        'i'
                    ),
                };
            }

            const result = await Transaction.aggregate([
                {
                    $match: match,
                },
                {
                    $group: {
                        _id: null,
                        total: {
                            $sum: '$amount',
                        },
                        transactionCount: {
                            $sum: 1,
                        },
                    },
                },
            ]);

            const data = {
                category,
                period: 'this month',
                total: result[0]?.total || 0,
                transactionCount:
                    result[0]?.transactionCount || 0,
            };

            const aiResult = await addAIAnswer(
                question,
                data
            );

            return res.json({
                intent: category
                    ? 'category_total'
                    : 'period_total',

                question,

                data,

                answer: aiResult.answer,

                aiGenerated:
                    aiResult.aiGenerated,
            });
        }

        // ==================================================
        // 3. COMPARE THIS MONTH VS LAST MONTH
        //
        // Example:
        // "Compare my spending this month vs last month."
        // ==================================================

        if (
            normalized.includes('compare') &&
            normalized.includes('spending')
        ) {
            const thisMonth = getMonthRange(0);
            const lastMonth = getMonthRange(-1);

            const result = await Transaction.aggregate([
                {
                    $match: {
                        user: req.user,
                        type: 'expense',
                        date: {
                            $gte: lastMonth.start,
                            $lt: thisMonth.end,
                        },
                    },
                },
                {
                    $group: {
                        _id: {
                            $cond: [
                                {
                                    $gte: [
                                        '$date',
                                        thisMonth.start,
                                    ],
                                },
                                'thisMonth',
                                'lastMonth',
                            ],
                        },
                        total: {
                            $sum: '$amount',
                        },
                    },
                },
            ]);

            const totals = {
                thisMonth: 0,
                lastMonth: 0,
            };

            result.forEach((item) => {
                totals[item._id] = item.total;
            });

            // The backend performs the calculation.
            const difference =
                totals.thisMonth -
                totals.lastMonth;

            const percentageChange =
                totals.lastMonth === 0
                    ? null
                    : Number(
                        (
                            (difference /
                                totals.lastMonth) *
                            100
                        ).toFixed(2)
                    );

            const data = {
                thisMonth: totals.thisMonth,
                lastMonth: totals.lastMonth,
                difference,
                percentageChange,
            };

            const aiResult = await addAIAnswer(
                question,
                data
            );

            return res.json({
                intent: 'period_comparison',

                question,

                data,

                answer: aiResult.answer,

                aiGenerated:
                    aiResult.aiGenerated,
            });
        }

        // ==================================================
        // 4. TOP SPENDING CATEGORY
        //
        // Example:
        // "What category did I spend the most on?"
        // ==================================================

        if (
            normalized.includes('category') &&
            normalized.includes('most')
        ) {
            const { start, end } = getMonthRange(0);

            const result = await Transaction.aggregate([
                {
                    $match: {
                        user: req.user,
                        type: 'expense',
                        date: {
                            $gte: start,
                            $lt: end,
                        },
                    },
                },
                {
                    $group: {
                        _id: '$category',
                        total: {
                            $sum: '$amount',
                        },
                    },
                },
                {
                    $sort: {
                        total: -1,
                    },
                },
                {
                    $limit: 1,
                },
            ]);

            const data = {
                category: result[0]?._id || null,
                total: result[0]?.total || 0,
                period: 'this month',
            };

            const aiResult = await addAIAnswer(
                question,
                data
            );

            return res.json({
                intent: 'top_category',

                question,

                data,

                answer: aiResult.answer,

                aiGenerated:
                    aiResult.aiGenerated,
            });
        }

        // ==================================================
        // 5. INCOME THIS MONTH
        //
        // Example:
        // "How much did I earn this month?"
        // ==================================================

        if (
            normalized.includes('earn') &&
            normalized.includes('this month')
        ) {
            const { start, end } = getMonthRange(0);

            const result = await Transaction.aggregate([
                {
                    $match: {
                        user: req.user,
                        type: 'income',
                        date: {
                            $gte: start,
                            $lt: end,
                        },
                    },
                },
                {
                    $group: {
                        _id: null,
                        total: {
                            $sum: '$amount',
                        },
                        transactionCount: {
                            $sum: 1,
                        },
                    },
                },
            ]);

            const data = {
                period: 'this month',
                total: result[0]?.total || 0,
                transactionCount:
                    result[0]?.transactionCount || 0,
            };

            const aiResult = await addAIAnswer(
                question,
                data
            );

            return res.json({
                intent: 'income_total',

                question,

                data,

                answer: aiResult.answer,

                aiGenerated:
                    aiResult.aiGenerated,
            });
        }

        // ==================================================
        // UNSUPPORTED QUESTION
        // ==================================================

        return res.status(400).json({
            msg: 'I could not understand that question yet.',

            supportedQuestions: [
                'How much did I spend this month?',
                'How much did I spend on food last month?',
                'Compare my spending this month vs last month.',
                'What category did I spend the most on?',
                'How much did I earn this month?',
            ],
        });
    } catch (err) {
        console.error('Insights error:', err);

        return res.status(500).json({
            msg: 'Server error',
        });
    }
});

module.exports = router;