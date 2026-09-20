const express = require('express');
const router = express.Router();
const connectToDatabase = require('../models/db');

router.get('/', async (req, res, next) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('gifts');

        let query = {};

        // Filter by name using a case insensitive partial match
        if (req.query.name && req.query.name.trim() !== '') {
            query.name = { $regex: req.query.name, $options: 'i' };
        }

        // Filter by category
        if (req.query.category) {
            query.category = req.query.category;
        }

        // Filter by condition
        if (req.query.condition) {
            query.condition = req.query.condition;
        }

        // Filter by maximum age in years
        if (req.query.age_years) {
            query.age_years = { $lte: parseInt(req.query.age_years) };
        }

        const gifts = await collection.find(query).toArray();
        res.json(gifts);
    } catch (e) {
        console.error('Error searching gifts:', e);
        next(e);
    }
});

module.exports = router;
