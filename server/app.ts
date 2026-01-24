import express, { Request, Response } from "express";
import cors from "cors";
import { env } from "./config/env";
import authRoutes from "./src/auth/auth.routes";
import userRoutes from "./src/user/user.routes";
import passwordRoutes from "./src/password/password.routes";
import { authAdminRouter } from "./src/admin/authAdmin/authAdmin.routes";
import { profileAdminRouter } from "./src/admin/profileAdmin/profileAdmin.routes";
import { verificationRouter } from "./src/admin/verification/verification.routes";
import { adminOverviewRoutes } from "./src/admin/adminOverview/adminOverview.routes";
import { adminNotificationRoutes } from "./src/admin/adminNotification/adminNotification.routes";
import galleryRouter from "./src/gallery/gallery.routes";
import contactRouter from "./src/contact/contact.routes";
import eventRoutes from "./src/event/event.routes";
import partnersRoutes from "./src/partners/partners.routes";
import postRoutes from "./src/community/post/post.routes";
import commentRoutes from "./src/community/comments/comment.routes";
import availabilityRoutes from "./src/availability/availability.routes";
import favoritesRoutes from "./src/community/favorites/favorites.routes";
import professionnelRouter from "./src/professional/professional.routes";
import appointmentRoutes from "./src/appointment/appointment.routes";
import { authLimiter, basicSecurity, generalLimiter, noSqlInjectionMiddleware } from "./middlewares/security";
import { requestLogger } from "./middlewares/logger";
import { notFoundHandler, errorHandler } from "./middlewares/errorHandler";


// Import des middlewares


const app = express();

// 🔒 1. Middlewares de sécurité de base
app.use(basicSecurity);

// 📊 2. Logging des requêtes
app.use(requestLogger);

// 🌐 3. CORS
const allowedOrigins = ["http://localhost:3000", "http://localhost:5173"];
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// 📦 4. Body parsers avec limites
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 🚫 5. Protection NoSQL (APRES les body parsers)
app.use(noSqlInjectionMiddleware);

// 🛡️ 6. Rate limiting
app.use("/api/auth/", authLimiter);
app.use("/api/", generalLimiter);

// 🛣️ 7. Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/password", passwordRoutes);
app.use('/api/auth/password', passwordRoutes);
app.use('/api/admin/auth', authAdminRouter);
app.use('/api/admin/profile', profileAdminRouter);
app.use('/api/admin/verification', verificationRouter);
app.use('/api/admin/overview', adminOverviewRoutes);
app.use('/api/admin/notifications', adminNotificationRoutes);
app.use('/api/contact', contactRouter);
app.use('/api/gallery', galleryRouter);
app.use('/api/professional', professionnelRouter);
app.use('/api/partners', partnersRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/community/posts', postRoutes);
app.use('/api/community', commentRoutes);
app.use('/api/community/favorites', favoritesRoutes);
app.use('/api/availabilities', availabilityRoutes);
app.use('/api/appointments', appointmentRoutes);
// 🏠 8. Route de test  
app.get("/", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "🚀 Backend Solidarity connecté et sécurisé !"
  });
});

// ❌ 9. Gestion des routes non trouvées
app.use(notFoundHandler);

// ⚠️ 10. Gestion centrale des erreurs
app.use(errorHandler);

export default app;