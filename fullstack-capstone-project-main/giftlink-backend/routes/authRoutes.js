const express = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const connectToDatabase = require('../models/db');
const logger = require('../logger');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// Register a new user
router.post('/register', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('users');

        const existingEmail = await collection.findOne({ email: req.body.email });
        if (existingEmail) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        const salt = await bcryptjs.genSalt(10);
        const hash = await bcryptjs.hash(req.body.password, salt);

        const newUser = await collection.insertOne({
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: hash,
            createdAt: new Date()
        });

        const authtoken = jwt.sign({ user: { id: newUser.insertedId } }, JWT_SECRET);
        logger.info('User registered successfully');
        res.json({ authtoken, email: req.body.email });
    } catch (e) {
        logger.error(e);
        res.status(500).send('Internal server error');
    }
});

// Login an existing user
router.post('/login', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('users');

        const theUser = await collection.findOne({ email: req.body.email });
        if (!theUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        const passwordMatch = await bcryptjs.compare(req.body.password, theUser.password);
        if (!passwordMatch) {
            return res.status(404).json({ error: 'Wrong password' });
        }

        const authtoken = jwt.sign({ user: { id: theUser._id.toString() } }, JWT_SECRET);
        res.json({ authtoken, userName: theUser.firstName, userEmail: theUser.email });
    } catch (e) {
        logger.error(e);
        res.status(500).send('Internal server error');
    }
});

// Update user information
router.put('/update', async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const email = req.headers.email;
        if (!email) {
            return res.status(400).json({ error: 'Email not found in the request headers' });
        }

        const db = await connectToDatabase();
        const collection = db.collection('users');

        const existingUser = await collection.findOne({ email: email });
        if (!existingUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        existingUser.firstName = req.body.name || existingUser.firstName;
        existingUser.updatedAt = new Date();

        const updatedUser = await collection.findOneAndUpdate(
            { email: email },
            { $set: existingUser },
            { returnDocument: 'after' }
        );

        const authtoken = jwt.sign({ user: { id: existingUser._id.toString() } }, JWT_SECRET);
        res.json({ authtoken });
    } catch (e) {
        logger.error(e);
        res.status(500).send('Internal server error');
    }
});

module.exports = router;
