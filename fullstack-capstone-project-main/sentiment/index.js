const express = require('express');
const router = express.Router();
const Sentiment = require('sentiment');
const sentiment = new Sentiment();

// POST /api/sentiment or GET / - Evaluate sentiment score
router.post('/', async (req, res) => {
    try {
        const { sentence } = req.body;
        if (!sentence) {
            return res.status(400).json({ error: 'Sentence parameter is required' });
        }

        const result = sentiment.analyze(sentence);
        res.json({ score: result.score, comparative: result.comparative, tokens: result.tokens });
    } catch (error) {
        console.error('Error analyzing sentiment:', error);
        res.status(500).send('Error analyzing sentiment');
    }
});

module.exports = router;