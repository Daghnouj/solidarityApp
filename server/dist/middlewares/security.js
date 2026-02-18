"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.basicSecurity = exports.payloadSizeLimiter = exports.noSqlInjectionMiddleware = exports.generalLimiter = exports.authLimiter = exports.securityHeaders = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const helmet_1 = __importDefault(require("helmet"));
exports.securityHeaders = (0, helmet_1.default)();
exports.authLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: {
        success: false,
        message: 'Trop de tentatives de connexion, réessayez dans 15 minutes'
    }
});
exports.generalLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 1000,
    message: {
        success: false,
        message: 'Trop de requêtes, réessayez plus tard'
    }
});
const noSqlInjectionMiddleware = (req, res, next) => {
    try {
        const sanitizeBody = (body) => {
            if (!body || typeof body !== 'object')
                return body;
            const sanitized = Array.isArray(body) ? [] : {};
            for (const [key, value] of Object.entries(body)) {
                if (typeof key === 'string' && key.startsWith('$')) {
                    continue;
                }
                if (value && typeof value === 'object') {
                    sanitized[key] = sanitizeBody(value);
                }
                else {
                    sanitized[key] = value;
                }
            }
            return sanitized;
        };
        if (req.body && typeof req.body === 'object') {
            req.body = sanitizeBody(req.body);
        }
        next();
    }
    catch (error) {
        console.warn('⚠️ Erreur lors du nettoyage NoSQL:', error);
        next();
    }
};
exports.noSqlInjectionMiddleware = noSqlInjectionMiddleware;
const payloadSizeLimiter = (req, res, next) => {
    const contentLength = parseInt(req.get('Content-Length') || '0');
    if (contentLength > 10 * 1024 * 1024) {
        res.status(413).json({
            success: false,
            message: 'Fichier trop volumineux. Maximum 10MB autorisé.'
        });
        return;
    }
    next();
};
exports.payloadSizeLimiter = payloadSizeLimiter;
exports.basicSecurity = [
    exports.securityHeaders,
    exports.payloadSizeLimiter
];
//# sourceMappingURL=security.js.map