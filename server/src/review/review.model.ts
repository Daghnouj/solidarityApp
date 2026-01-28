import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
    professional: mongoose.Types.ObjectId;
    author: mongoose.Types.ObjectId;
    rating: number;
    comment: string;
    createdAt: Date;
    updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
    {
        professional: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        comment: {
            type: String,
            required: true,
            trim: true,
            maxlength: 1000
        }
    },
    {
        timestamps: true
    }
);

// Compound index to prevent duplicate reviews from same user
reviewSchema.index({ professional: 1, author: 1 }, { unique: true });

export const Review = mongoose.model<IReview>('Review', reviewSchema);
