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
  }
});

// Initialize socket handlers
initSocket(io);

// Set io instance for socket utilities
import { setIOInstance } from "./src/socket";
setIOInstance(io);

// Make io instance globally accessible
app.set('io', io);

// Middleware to attach io to requests
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Connexion MongoDB
connectDB();

// Démarrage du serveur
server.listen(env.PORT, () => {
  console.log(`✅ Serveur lancé sur http://localhost:${env.PORT}`);
  console.log(`🔌 Socket.IO initialisé`);
});
