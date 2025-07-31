import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const uri = process.env.ATLAS_URI;
if (!uri) {
  throw new Error("Missing ATLAS_URI in .env file");
}

const connectDB = async (retries = 5, delay = 3000) => {
  try {
    const conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB connected: ${conn.connection.host}`);

    conn.connection.on("error", (err) => {
      console.error("❌ MongoDB runtime connection error:", err);
    });
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

export default connectDB;
