const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const createToken = (userId) =>
    jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });

// POST /api/auth/register
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existing = await User.findOne({ email });
        if (existing)
            return res.status(400).json({ msg: 'Email already registered' });

        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password, salt);
        const user = await User.create({ name, email, password: hashed });

        res.status(201).json({
            token: createToken(user._id),
            user: { id: user._id, name: user.name, email: user.email },
        });
    } catch (err) {
        console.error('Register error:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user)
            return res.status(400).json({ msg: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(400).json({ msg: 'Invalid credentials' });

        res.json({
            token: createToken(user._id),
            user: { id: user._id, name: user.name, email: user.email },
        });
    } catch (err) {
        console.error('Login error:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;