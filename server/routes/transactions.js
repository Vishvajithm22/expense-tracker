const router = require('express').Router();
const auth = require('../middleware/auth');
const Transaction = require('../models/Transaction');

// GET /api/transactions — get all for logged-in user
router.get('/', auth, async (req, res) => {
    try {
        const transactions = await Transaction
            .find({ user: req.user })
            .sort({ date: -1 });
        res.json(transactions);
    } catch (err) {
        console.error('Get transactions error:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

// POST /api/transactions — add new transaction
router.post('/', auth, async (req, res) => {
    const { title, amount, type, category, date } = req.body;
    try {
        const transaction = await Transaction.create({
            user: req.user,
            title,
            amount,
            type,
            category,
            date: date || Date.now(),
        });
        res.status(201).json(transaction);
    } catch (err) {
        console.error('Add transaction error:', err.message);
        res.status(400).json({ msg: err.message });
    }
});

// DELETE /api/transactions/:id
router.delete('/:id', auth, async (req, res) => {
    try {
        const transaction = await Transaction.findOneAndDelete({
            _id: req.params.id,
            user: req.user,
        });
        if (!transaction)
            return res.status(404).json({ msg: 'Transaction not found' });

        res.json({ msg: 'Deleted', id: req.params.id });
    } catch (err) {
        console.error('Delete error:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;