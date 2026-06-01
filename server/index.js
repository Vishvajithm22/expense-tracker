const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/transactions', require('./routes/transactions'));

app.get('/', (req, res) => res.json({ msg: 'FinHub API running ✅' }));

mongoose
    .connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 10000,
        family: 4,   // ← forces IPv4, fixes ECONNREFUSED on some systems
    })
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