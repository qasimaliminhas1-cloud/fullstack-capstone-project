const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const natural = require('natural');
const logger = require('./logger');

const app = express();
const port = process.env.PORT || 3050;

app.use(express.json());
app.use(cors());

// Sentiment analysis endpoint
app.post('/sentiment', async (req, res) => {
    const { sentence } = req.body;

    if (!sentence) {
        logger.error('No sentence provided');
        return res.status(400).json({ error: 'No sentence provided' });
    }

    // Initialize the sentiment analyzer with the Natural library
    const Analyzer = natural.SentimentAnalyzer;
    const stemmer = natural.PorterStemmer;
    const analyzer = new Analyzer('English', stemmer, 'afinn');

    try {
        const analysisResult = analyzer.getSentiment(sentence.split(' '));

        let sentiment = 'neutral';
        if (analysisResult < 0) {
            sentiment = 'negative';
        } else if (analysisResult > 0.33) {
            sentiment = 'positive';
        }

        logger.info('Sentiment analysis result: ' + analysisResult);
        res.status(200).json({ sentimentScore: analysisResult, sentiment: sentiment });
    } catch (error) {
        logger.error('Error performing sentiment analysis', error);
        res.status(500).json({ message: 'Error performing sentiment analysis' });
    }
});

app.listen(port, () => {
    console.log(`Sentiment analysis server running on port ${port}`);
});
