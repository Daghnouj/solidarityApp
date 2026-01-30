import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Admin } from '../src/admin/admin.model';
import { env } from '../config/env';

interface JwtPayload {
    id: string;
    role: string;
}

/**
 * Optional authentication middleware
 * Attempts to authenticate the request, but doesn't reject if no token is provided
 * Sets req.isAdmin = true if valid admin token is found
 */
export const optionalAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        let token: string | undefined;

        // Try to get token from Authorization header
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1];
        }

        // If no token, just proceed without authentication
        if (!token) {
            (req as any).isAdmin = false;
            next();
            return;
        }

        // Verify token
        const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

        // Check if it's an admin
        if (decoded.role === 'admin') {
            const admin = await Admin.findById(decoded.id).select("-mdp");

            if (admin) {
                (req as any).admin = admin;
                (req as any).isAdmin = true;
                next();
                return;
            }
        }

        // Valid token but not admin
        (req as any).isAdmin = false;
        next();
    } catch (error: any) {
        // On error, just proceed without authentication (don't reject)
        (req as any).isAdmin = false;
        next();
    }
};
