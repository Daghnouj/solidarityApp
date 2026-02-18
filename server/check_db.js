
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env from current directory
dotenv.config({ path: path.join(__dirname, '.env') });

const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
    console.error('MONGO_URI not found in env');
    process.exit(1);
}

async function checkArticles() {
    try {
        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');

        // Simple schema-less query
        const articles = await mongoose.connection.db.collection('blogarticles').find({}).toArray();
        console.log(`Total articles in DB: ${articles.length}`);

        console.log('Latest 10 articles:');
        articles.sort((a, b) => b.createdAt - a.createdAt).slice(0, 10).forEach((a) => {
            console.log(`- ID: ${a._id}, Title: ${a.title}, Status: ${a.status}, Slug: ${a.slug}`);
        });

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
}

checkArticles();
