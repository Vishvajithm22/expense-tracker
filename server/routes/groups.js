const router = require('express').Router();
const auth = require('../middleware/auth');
const Group = require('../models/Group');
const User = require('../models/User');

// GET /api/groups — all groups I belong to
router.get('/', auth, async (req, res) => {
    try {
        const groups = await Group.find({ members: req.user })
            .populate('members', 'name email')
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 });
        res.json(groups);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// POST /api/groups — create new group
router.post('/', auth, async (req, res) => {
    const { name } = req.body;
    try {
        const group = await Group.create({
            name,
            createdBy: req.user,
            members: [req.user],
        });
        const populated = await group.populate('members', 'name email');
        res.status(201).json(populated);
    } catch (err) {
        res.status(400).json({ msg: err.message });
    }
});

// GET /api/groups/:id — single group with all details
router.get('/:id', auth, async (req, res) => {
    try {
        const group = await Group.findById(req.params.id)
            .populate('members', 'name email')
            .populate('createdBy', 'name email')
            .populate('expenses.paidBy', 'name email')
            .populate('expenses.splitAmong', 'name email')
            .populate('settlements.from', 'name email')
            .populate('settlements.to', 'name email');

        if (!group) return res.status(404).json({ msg: 'Group not found' });

        const isMember = group.members.some(m => m._id.toString() === req.user);
        if (!isMember) return res.status(403).json({ msg: 'Not a member' });

        res.json(group);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// POST /api/groups/:id/members — add member by email
router.post('/:id/members', auth, async (req, res) => {
    const { email } = req.body;
    try {
        const group = await Group.findById(req.params.id);
        if (!group) return res.status(404).json({ msg: 'Group not found' });

        const userToAdd = await User.findOne({ email });
        if (!userToAdd) return res.status(404).json({ msg: 'No FinHub user with that email' });

        const already = group.members.some(m => m.toString() === userToAdd._id.toString());
        if (already) return res.status(400).json({ msg: 'Already a member' });

        group.members.push(userToAdd._id);
        await group.save();

        const populated = await group.populate('members', 'name email');
        res.json(populated);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// POST /api/groups/:id/expenses — add expense split equally
router.post('/:id/expenses', auth, async (req, res) => {
    const { title, amount } = req.body;
    try {
        const group = await Group.findById(req.params.id);
        if (!group) return res.status(404).json({ msg: 'Group not found' });

        group.expenses.push({
            title,
            amount: Number(amount),
            paidBy: req.user,
            splitAmong: group.members,
        });
        await group.save();

        const populated = await group.populate([
            { path: 'members', select: 'name email' },
            { path: 'expenses.paidBy', select: 'name email' },
            { path: 'expenses.splitAmong', select: 'name email' },
        ]);
        res.json(populated);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// POST /api/groups/:id/settle — mark a debt as settled
router.post('/:id/settle', auth, async (req, res) => {
    const { toUserId, amount } = req.body;
    try {
        const group = await Group.findById(req.params.id);
        if (!group) return res.status(404).json({ msg: 'Group not found' });

        group.settlements.push({
            from: req.user,
            to: toUserId,
            amount: Number(amount),
        });
        await group.save();

        const populated = await group.populate([
            { path: 'members', select: 'name email' },
            { path: 'settlements.from', select: 'name email' },
            { path: 'settlements.to', select: 'name email' },
        ]);
        res.json(populated);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;