import dns from 'node:dns/promises';
// Or for CommonJS: const dns = require('node:dns/promises');
dns.setServers(['1.1.1.1']); // Use Cloudflare's public DNS
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import app from "./app";
import connectDB from "./config/db";
import { env } from "./config/env";
import { initSocket } from "./src/socket";

const server = http.createServer(app);

// Initialize Socket.IO
const io = new SocketIOServer(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ['websocket', 'polling'], // Ajoutez ceci
  pingTimeout: 60000,
  pingInterval: 25000,
  cookie: true,
  allowEIO3: true // Pour compatibilité
});

// Ajoutez ce middleware pour logger les erreurs de connexion
io.engine.on("connection_error", (err) => {
  console.log("Socket.IO connection error:", err);
});
// Initialize socket handlers
initSocket(io);

// Set io instance for socket utilities
import { setIOInstance } from "./src/socket";
setIOInstance(io);

// Make io instance globally accessible to app
app.set('io', io);



// Connexion MongoDB
connectDB();

// Démarrage du serveur
server.listen(env.PORT, () => {
  console.log(`✅ Serveur lancé sur http://localhost:${env.PORT}`);
  console.log(`🔌 Socket.IO initialisé`);
  console.log(`🌐 Origins autorisées:`, ["http://localhost:3000", "http://localhost:5173"]);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});
