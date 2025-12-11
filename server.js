
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

import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";





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

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'No authorization header' });
  const parts = auth.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return res.status(401).json({ error: 'Invalid authorization' });

  const token = parts[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // contains sub/email
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

app.get('/api/admin/me', authMiddleware, (req, res) => {
  const userId = req.user.sub;
  const user = users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ user: { id: user.id, name: user.name, email: user.email } });
});

app.get("/",(req,res)=>{
      const actualPort = req.socket.localPort;
    res.send(`HELLO! Port=${actualPort}`)

});
const PORT = process.env.PORT || 5000;



app.listen(PORT,()=>{console.log("OK")})