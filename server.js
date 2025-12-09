
import dotenv from "dotenv";
dotenv.config();

// import { fileURLToPath } from 'url';
// import { dirname } from 'path';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// console.log("Server running from directory:", __dirname);


import express from 'express';
import cors from "cors";
//import connectDB from "./db.js";
import routes from "./authRoutes.js"
import adminRoutes from './adminRoute.js';
//import connectDBplay from "./dbplay.js";
// import dotenv from "dotenv";
// dotenv.config();
import cloudinary from "./cloudin.js"
//console.log("Loading .env from:", __dirname);
import uploadRoute from "./uploadRoute.js";
import authRoutes from "./authRoutes.js";
import ListRoute from "./listRoute.js";
import songRoutes from "./uploadRoute.js";
import fetchsongs from "./getSong.js";





console.log("Cloudinary connected with:", cloudinary.config());

const app = express();
app.use(express.json());
app.use(cors());
//connectDB();
//connectDBplay();

app.use("/api/admin", uploadRoute);


app.use("/api/auth", routes);
app.use('/api/admin', adminRoutes);

app.use("/api/admin",ListRoute)
app.use("/api/admin", songRoutes);
app.use("/api", fetchsongs);

app.get("/",(req,res)=>{res.send("HELLO!")});

app.listen(5000,()=>{console.log("OK")})