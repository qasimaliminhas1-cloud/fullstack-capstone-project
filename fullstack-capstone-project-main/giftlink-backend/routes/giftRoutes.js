const express = require('express');
const router = express.Router();
const connectToDatabase = require('../models/db');

// GET all gifts
router.get('/', async (req, res, next) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('gifts');
        const gifts = await collection.find({}).toArray();
        res.json(gifts);
    } catch (e) {
        console.error('Error fetching gifts:', e);
        next(e);
    }
});

// GET a single gift by id
router.get('/:id', async (req, res, next) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('gifts');
        const id = req.params.id;
        const gift = await collection.findOne({ id: id });
        if (!gift) {
            return res.status(404).send('Gift not found');
        }
        res.json(gift);
    } catch (e) {
        console.error('Error fetching gift:', e);
        next(e);
    }
});

// POST a new gift
router.post('/', async (req, res, next) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('gifts');
        const result = await collection.insertOne(req.body);
        res.status(201).json(result);
    } catch (e) {
        console.error('Error adding gift:', e);
        next(e);
    }
});

module.exports = router;
