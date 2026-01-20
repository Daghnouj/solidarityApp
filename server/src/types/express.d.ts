// express.d.ts - SIMPLIFIÉ
import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: any; // Flexible, accepte n'importe quel type
      io?: any;
      file?: Express.Multer.File;
    }
  }
}

namespace Multer {
  interface File {
    url?: string;
    public_id?: string;
    secure_url?: string;
    format?: string;
    width?: number;
    height?: number;
  }
}

export interface ProtectedRequest extends Request {
  user: any; // Flexible
}

export interface AuthRequest extends ProtectedRequest {
  body: {
    email: string;
    mdp: string;
    nom?: string;
    role?: string;
  };
}