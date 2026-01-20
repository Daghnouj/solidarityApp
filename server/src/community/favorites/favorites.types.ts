import { Types } from 'mongoose';

export interface ToggleFavoriteRequest {
  postId: string;
  userId: Types.ObjectId;
}