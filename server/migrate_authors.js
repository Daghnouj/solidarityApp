
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

const blogArticleSchema = new mongoose.Schema({
    authorRole: String,
    authorModel: String
}, { strict: false });

const BlogArticle = mongoose.model('BlogArticle', blogArticleSchema);

async function migrate() {
    try {
        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');

        // Update articles where authorRole is admin
        const adminResult = await BlogArticle.updateMany(
            { authorRole: 'admin', authorModel: { $exists: false } },
            { $set: { authorModel: 'Admin' } }
        );
        console.log(`Updated ${adminResult.modifiedCount} articles for Admin authors`);

        // Update articles where authorRole is professional
        const profResult = await BlogArticle.updateMany(
            { authorRole: 'professional', authorModel: { $exists: false } },
            { $set: { authorModel: 'User' } }
        );
        console.log(`Updated ${profResult.modifiedCount} articles for Professional authors`);

        console.log('Migration completed successfully');
    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        await mongoose.disconnect();
    }
}

migrate();
