"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("./env");
const connectDB = async () => {
    try {
        await mongoose_1.default.connect(env_1.env.MONGO_URI, {
            ssl: true,
            authSource: "admin",
        });
        console.log("✅ MongoDB connecté avec succès !");
        return mongoose_1.default;
    }
    catch (error) {
        console.error("❌ Erreur de connexion MongoDB :", error.message);
        process.exit(1);
    }
};
exports.default = connectDB;
//# sourceMappingURL=db.js.map