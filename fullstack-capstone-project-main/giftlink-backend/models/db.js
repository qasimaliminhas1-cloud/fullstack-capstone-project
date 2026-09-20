require('dotenv').config();
const { MongoClient } = require('mongodb');

const url = process.env.MONGO_URI || process.env.MONGO_URL;
const dbName = 'giftdb';

let dbInstance = null;

async function connectToDatabase() {
    if (dbInstance) {
        return dbInstance;
    }

    if (!url) {
        throw new Error('Missing MongoDB connection string. Set MONGO_URI in .env.');
    }

    const client = new MongoClient(url);

    // Task 1: Connect to MongoDB
    await client.connect();

    // Task 2: Connect to giftdb and store the database instance
    dbInstance = client.db(dbName);

    // Task 3: Return the database instance
    return dbInstance;
}

module.exports = connectToDatabase;
