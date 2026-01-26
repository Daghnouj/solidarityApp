
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../src/user/user.model';
import { ProtectedRequest } from '../src/types/express';
import { env } from '../config/env';

interface JwtPayload {
    id: string;
    role: string;
}

/**
 * Middleware that optionally extracts the user from the JWT token.
 * If a valid token is provided, req.user is set.
 * If no token is provided or the token is invalid, the request continues without req.user.
 * This is useful for routes that are public but provide extra info for logged-in users.
 */
const optionalProtect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        let token: string | undefined;

        // Get token from headers
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1];
        }

        if (token) {
            try {
                // Verify token
                const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

                // Get user
                const user = await User.findById(decoded.id).select("-mdp");
                if (user && user.isActive) {
                    // Add user to request
                    (req as ProtectedRequest).user = user;
                }
            } catch (jwtError) {
                // Token is invalid or expired, just ignore it and continue
                console.warn("Optional Auth: Invalid token provided, continuing as guest.");
            }
        }

        next();
    } catch (error) {
        console.error("Optional Auth Middleware Error:", error);
        next(); // Always continue
    }
};

export { optionalProtect };
