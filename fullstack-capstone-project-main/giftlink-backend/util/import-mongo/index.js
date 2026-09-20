require('dotenv').config();
const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

const url = process.env.MONGO_URI || process.env.MONGO_URL;
const dbName = 'giftdb';
const collectionName = 'gifts';

const filename = path.join(__dirname, 'gifts.json');
const data = JSON.parse(fs.readFileSync(filename, 'utf8')).docs;

async function loadData() {
    const client = new MongoClient(url);
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        const collection = client.db(dbName).collection(collectionName);
        await collection.deleteMany({});
        const result = await collection.insertMany(data);
        console.log('Inserted ' + result.insertedCount + ' documents into the gifts collection');
        console.log('Total documents in giftdb.gifts: ' + (await collection.countDocuments()));
    } catch (err) {
        console.error('Import failed:', err.message);
    } finally {
        await client.close();
        console.log('Connection closed');
    }
}

loadData();
