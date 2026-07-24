const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

const cors = require("cors");

app.use(
    cors({
        origin: [
            "http://localhost:3000",
            "https://expense-tracker-five-iota-91.vercel.app",
            "https://expense-tracker-f2953k8aa-project-89d8.vercel.app",
        ],
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        credentials: true,
    })
);

app.options("*", cors());

app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/transactions', require('./routes/transactions'));
app.use('/api/groups', require('./routes/groups'));

app.get('/', (req, res) => res.json({ msg: 'FinHub API running ✅' }));

mongoose
    .connect(process.env.MONGO_URI, { family: 4 })
    .then(() => {
        console.log('✅ MongoDB connected');
        app.listen(process.env.PORT || 5000, () =>
            console.log(`🚀 Server running on port ${process.env.PORT || 5000}`)
        );
    })
    .catch(err => {
        console.error('❌ MongoDB connection failed:', err.message);
        process.exit(1);
    });