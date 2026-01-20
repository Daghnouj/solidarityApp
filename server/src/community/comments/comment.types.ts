import { Types, Document } from 'mongoose';

export interface IReplyBase {
  user: Types.ObjectId;
  text: string;
  date: Date;
  edited: boolean;
}

export interface IReply extends IReplyBase, Document {
  _id: Types.ObjectId;
}

// Interface pour la création d'une réponse (sans les champs Mongoose)
export interface CreateReplyData {
  user: Types.ObjectId;
  text: string;
  date: Date;
  edited?: boolean;
}

export interface ICommentBase {
  user: Types.ObjectId;
  text: string;
  date: Date;
  edited: boolean;
  replies: IReply[];
}

export interface IComment extends ICommentBase, Document {
  _id: Types.ObjectId;
}

// Interface pour la création d'un commentaire (sans les champs Mongoose)
export interface CreateCommentData {
  user: Types.ObjectId;
  text: string;
  date: Date;
  edited?: boolean;
  replies?: CreateReplyData[];
}

export interface AddCommentRequest {
  comment: string;
}

export interface AddReplyRequest {
  replyText: string;
}

export interface UpdateCommentRequest {
  newText: string;
}

export interface UpdateReplyRequest {
  newText: string;
}