import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js";

const app = express();

// Middleware
app.use(express.json());

app.use(cors({
  origin: ["http://localhost:5173", "https://fly-gpt-frontend.vercel.app"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],  // Include DELETE
  credentials: true,
}));


// MongoDB connection + start server
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("connected with database");

    app.listen(process.env.PORT, () => {
      console.log(`server is running on ${process.env.PORT}`);
    });
  } catch (err) {
    console.log("Failed to connect with Db", err);
  }
};

startServer();

// Routes
app.get("/", (req, res) => {
  res.send("hello");
});

app.use("/", chatRoutes);
