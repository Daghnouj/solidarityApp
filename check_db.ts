
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import path from 'path';

// Force load env from server directory
dotenv.config({ path: path.join(__dirname, 'server', '.env') });

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
    console.error('MONGODB_URI not found in env');
    process.exit(1);
}

async function checkArticles() {
    try {
        await mongoose.connect(mongoUri!);
        console.log('Connected to MongoDB');

        const BlogArticle = mongoose.model('BlogArticle', new mongoose.Schema({}, { strict: false }));

        const count = await BlogArticle.countDocuments();
        console.log(`Total articles in DB: ${count}`);

        const latest = await BlogArticle.find().sort({ createdAt: -1 }).limit(5);
        console.log('Latest 5 articles:');
        latest.forEach((a: any) => {
            console.log(`- ID: ${a._id}, Title: ${a.title}, Status: ${a.status}, Slug: ${a.slug}`);
        });

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
}

checkArticles();
