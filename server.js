import "dotenv/config";
import express from "express";

import cors from "cors";

import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js";

const app = express();
// const PORT = 8080;

app.use(express.json());
app.use(cors());        // imp.

app.listen(process.env.PORT, ()=>{
    console.log(`server is running on ${process.env.PORT}`);
    connectDB();
});

const connectDB = async()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("connected with database");
    }
    catch(err){
        console.log("Failed to connect with Db",err);
    }
}
//.........................

app.get("/", (req, res)=>{
    res.send("hello");

});

app.use("/",chatRoutes);

