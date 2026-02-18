"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalProtect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../src/user/user.model"));
const env_1 = require("../config/env");
const optionalProtect = async (req, res, next) => {
    try {
        let token;
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1];
        }
        if (token) {
            try {
                const decoded = jsonwebtoken_1.default.verify(token, env_1.env.JWT_SECRET);
                const user = await user_model_1.default.findById(decoded.id).select("-mdp");
                if (user && user.isActive) {
                    req.user = user;
                }
            }
            catch (jwtError) {
                console.warn("Optional Auth: Invalid token provided, continuing as guest.");
            }
        }
        next();
    }
    catch (error) {
        console.error("Optional Auth Middleware Error:", error);
        next();
    }
};
exports.optionalProtect = optionalProtect;
//# sourceMappingURL=optionalProtect.js.map