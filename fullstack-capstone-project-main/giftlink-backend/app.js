require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pinoHttp = require('pino-http');
const pinoLogger = require('./logger');

const connectToDatabase = require('./models/db');
const giftRoutes = require('./routes/giftRoutes');
const searchRoutes = require('./routes/searchRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const port = process.env.PORT || 3060;

app.use(cors());
app.use(express.json());
app.use(pinoHttp({ logger: pinoLogger }));

connectToDatabase()
    .then(() => pinoLogger.info('Connected to MongoDB'))
    .catch((e) => console.error('Failed to connect to MongoDB', e));

// Route serving gifts
app.use('/api/gifts', giftRoutes);

// Route serving search
app.use('/api/search', searchRoutes);

// Route serving authentication
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('Inside the GiftLink server');
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('Internal Server Error');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
