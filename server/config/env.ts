// config/env.ts - AVEC REDIS CLOUD
import { z } from "zod";
import dotenv from "dotenv";

dotenv.config(); // Charge le fichier .env
 
// Définir le schéma de validation avec Zod
const envSchema = z.object({
  PORT: z.string().default("5000"),
  MONGO_URI: z.string().min(1, "❌ MONGO_URI est requis"),
  JWT_SECRET: z.string().min(1, "❌ JWT_SECRET est requis"),
  EMAIL_USER: z.string().email("❌ EMAIL_USER doit être un email valide"),
  EMAIL_PASS: z.string().min(1, "❌ EMAIL_PASS est requis"),

  // Redis Cloud configuration
  REDIS_URL: z.string().url("❌ REDIS_URL doit être une URL valide").optional(),
  REDIS_HOST: z.string().optional(),
  REDIS_PORT: z.string().optional(),
  REDIS_PASSWORD: z.string().optional(),
  REDIS_USERNAME: z.string().optional(),

  CLOUD_NAME: z.string().min(1, "❌ CLOUD_NAME est requis"),
  CLOUDINARY_API_KEY: z.string().min(1, "❌ CLOUDINARY_API_KEY est requis"),
  CLOUDINARY_API_SECRET: z.string().min(1, "❌ CLOUDINARY_API_SECRET est requis"),

  RECAPTCHA_SECRET_KEY: z.string().optional(),
  LUXAND_API_TOKEN: z.string().optional(),

  FRONTEND_URL: z.string().url("❌ FRONTEND_URL doit être une URL valide").optional(),
  FRONTEND: z.string().optional(),
  CLIENT_URL: z.string().optional(),

  FACEBOOK_APP_ID: z.string().optional(),
  FACEBOOK_APP_SECRET: z.string().optional(),

  SESSION_SECRET: z.string().min(1, "❌ SESSION_SECRET est requis"),

  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  REDIRECT_URI: z.string().optional(),

  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_MONTHLY_PRICE_ID: z.string().optional(),
  STRIPE_YEARLY_PRICE_ID: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),

  CLIENT_ID: z.string().optional(),
  CLIENT_SECRET: z.string().optional(),

  TWILIO_ACCOUNT_SID: z.string().optional(),
  TWILIO_AUTH_TOKEN: z.string().optional(),
  TWILIO_PHONE_NUMBER: z.string().optional(),
  TWILIO_TEST_MODE: z.string().optional(),
  TWILIO_TEST_NUMBERS: z.string().optional(),

  GEMINI_API_KEY: z.string().optional(),
});

// Validation
const parsedEnv = envSchema.safeParse(process.env);

// Gestion des erreurs
if (!parsedEnv.success) {
  console.error("❌ Erreurs dans le fichier .env :");
  console.error(parsedEnv.error.format());
  process.exit(1);
}

// Export des variables validées
export const env = parsedEnv.data;