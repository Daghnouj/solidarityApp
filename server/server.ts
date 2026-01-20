import dns from 'node:dns/promises';
// Or for CommonJS: const dns = require('node:dns/promises');
dns.setServers(['1.1.1.1']); // Use Cloudflare's public DNS
import http from "http";
import app from "./app";
import connectDB from "./config/db";
import { env } from "./config/env";


const server = http.createServer(app);

// Connexion MongoDB
connectDB();

// Démarrage du serveur
server.listen(env.PORT, () => {
  console.log(`✅ Serveur lancé sur http://localhost:${env.PORT}`);
});
