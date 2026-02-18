"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const zod_1 = require("zod");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const envSchema = zod_1.z.object({
    PORT: zod_1.z.string().default("5000"),
    MONGO_URI: zod_1.z.string().min(1, "❌ MONGO_URI est requis"),
    JWT_SECRET: zod_1.z.string().min(1, "❌ JWT_SECRET est requis"),
    EMAIL_USER: zod_1.z.string().email("❌ EMAIL_USER doit être un email valide"),
    EMAIL_PASS: zod_1.z.string().min(1, "❌ EMAIL_PASS est requis"),
    REDIS_URL: zod_1.z.string().url("❌ REDIS_URL doit être une URL valide").optional(),
    REDIS_HOST: zod_1.z.string().optional(),
    REDIS_PORT: zod_1.z.string().optional(),
    REDIS_PASSWORD: zod_1.z.string().optional(),
    REDIS_USERNAME: zod_1.z.string().optional(),
    CLOUD_NAME: zod_1.z.string().min(1, "❌ CLOUD_NAME est requis"),
    CLOUDINARY_API_KEY: zod_1.z.string().min(1, "❌ CLOUDINARY_API_KEY est requis"),
    CLOUDINARY_API_SECRET: zod_1.z.string().min(1, "❌ CLOUDINARY_API_SECRET est requis"),
    RECAPTCHA_SECRET_KEY: zod_1.z.string().optional(),
    LUXAND_API_TOKEN: zod_1.z.string().optional(),
    FRONTEND_URL: zod_1.z.string().url("❌ FRONTEND_URL doit être une URL valide").optional(),
    FRONTEND: zod_1.z.string().optional(),
    CLIENT_URL: zod_1.z.string().optional(),
    FACEBOOK_APP_ID: zod_1.z.string().optional(),
    FACEBOOK_APP_SECRET: zod_1.z.string().optional(),
    SESSION_SECRET: zod_1.z.string().min(1, "❌ SESSION_SECRET est requis"),
    GOOGLE_CLIENT_ID: zod_1.z.string().optional(),
    GOOGLE_CLIENT_SECRET: zod_1.z.string().optional(),
    REDIRECT_URI: zod_1.z.string().optional(),
    STRIPE_SECRET_KEY: zod_1.z.string().optional(),
    STRIPE_MONTHLY_PRICE_ID: zod_1.z.string().optional(),
    STRIPE_YEARLY_PRICE_ID: zod_1.z.string().optional(),
    STRIPE_WEBHOOK_SECRET: zod_1.z.string().optional(),
    CLIENT_ID: zod_1.z.string().optional(),
    CLIENT_SECRET: zod_1.z.string().optional(),
    TWILIO_ACCOUNT_SID: zod_1.z.string().optional(),
    TWILIO_AUTH_TOKEN: zod_1.z.string().optional(),
    TWILIO_PHONE_NUMBER: zod_1.z.string().optional(),
    TWILIO_TEST_MODE: zod_1.z.string().optional(),
    TWILIO_TEST_NUMBERS: zod_1.z.string().optional(),
    GEMINI_API_KEY: zod_1.z.string().optional(),
});
const parsedEnv = envSchema.safeParse(process.env);
if (!parsedEnv.success) {
    console.error("❌ Erreurs dans le fichier .env :");
    console.error(parsedEnv.error.format());
    process.exit(1);
}
exports.env = parsedEnv.data;
//# sourceMappingURL=env.js.map