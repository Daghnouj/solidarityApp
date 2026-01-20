import { Request } from 'express';
import { Types } from 'mongoose';

export interface IUserD{
  _id: Types.ObjectId;
  nom: string;
  photo: string;
  role: 'patient' | 'professional';
}

export interface SocketIORequest extends Request {
  io?: any;
  user: IUserD;
  params: {
    [key: string]: string;
    postId?: string;
    commentId?: string;
    replyId?: string;
  };
}