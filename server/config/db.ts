import mongoose from "mongoose";
import { env } from "./env"; 

const connectDB = async (): Promise<typeof mongoose> => {
  try {
    await mongoose.connect(env.MONGO_URI, {
      ssl: true,
      authSource: "admin",
    } as mongoose.ConnectOptions);

    console.log("✅ MongoDB connecté avec succès !");
    return mongoose;
  } catch (error) {
    console.error("❌ Erreur de connexion MongoDB :", (error as Error).message);
    process.exit(1);
  }
};

export default connectDB;
