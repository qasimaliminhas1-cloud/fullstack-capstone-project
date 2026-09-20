const express = require('express');
const router = express.Router();
const connectToDatabase = require('../models/db');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secret_token';

// Register a new user
router.post('/register', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection("users");

        const { email, password, firstName, lastName } = req.body;

        // Check if user already exists
        const existingUser = await collection.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash the password
        const salt = await bcryptjs.genSalt(10);
        const hash = await bcryptjs.hash(password, salt);

        const newUser = {
            email,
            firstName,
            lastName,
            password: hash,
            createdAt: new Date()
        };

        await collection.insertOne(newUser);

        // Generate JWT token
        const payload = { user: { id: newUser._id, email: newUser.email } };
        const authtoken = jwt.sign(payload, JWT_SECRET);

        res.json({ authtoken, email: newUser.email, firstName: newUser.firstName });
    } catch (e) {
        console.error('Error registering user:', e);
        res.status(500).send('Error registering user');
    }
});

// Login user
router.post('/login', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection("users");

        const { email, password } = req.body;

        const theUser = await collection.findOne({ email });
        if (!theUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isMatch = await bcryptjs.compare(password, theUser.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const payload = { user: { id: theUser._id, email: theUser.email } };
        const authtoken = jwt.sign(payload, JWT_SECRET);

        res.json({ authtoken, email: theUser.email, firstName: theUser.firstName });
    } catch (e) {
        console.error('Error logging in:', e);
        res.status(500).send('Error logging in');
    }
});

// Update user profile
router.put('/update', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection("users");

        const { email, firstName, lastName } = req.body;

        const existingUser = await collection.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        await collection.updateOne(
            { email },
            { $set: { firstName, lastName, updatedAt: new Date() } }
        );

        const payload = { user: { id: existingUser._id, email } };
        const authtoken = jwt.sign(payload, JWT_SECRET);

        res.json({ authtoken, email, firstName, lastName });
    } catch (e) {
        console.error('Error updating user:', e);
        res.status(500).send('Error updating user');
    }
});

module.exports = router;