import express from 'express';
const router = express.Router();

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Admin } from './models/admins.js'; // make sure your Admin model is exported correctly


import multer from 'multer';
import cloudinary from './cloudin.js'; // make sure your cloudin.js uses export default
import { Song } from './models/playlists.js'; // named export or default depending on your model

const upload = multer({ dest: 'uploads/' }); // temporary storage for uploaded files
// temp storage

// Upload song
router.post('/upload-song', upload.single('song'), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "video" // for audio files use "video"
    });

    const song = new Song({
      title: req.body.title,
      artist: req.body.artist,
      album: req.body.album,
      url: result.secure_url,
      cloudinary_id: result.public_id
    });

    await song.save();
    res.json(song);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all songs
router.get('/songs', async (req, res) => {
  try {
    const songs = await Song.find();
    res.json(songs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// -------------------- SIGNUP ROUTE --------------------
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await Admin.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Admin already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if this is the first user
    const userCount = await Admin.countDocuments();
    const isAdmin = userCount === 0; // first user becomes admin

    // Create user
    const user = new Admin({
      name,
      email,
      password: hashedPassword,
      isAdmin
    });

    await user.save();

    res.status(201).json({
      message: "Admin created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//LoginRoute
// LoginRoute (safe)
router.post('/login', async (req, res, next) => {
  console.log("Login body:", req.body);

  try {
    // Safe destructure in case req.body is undefined
    const { email, password } = req.body || {};

    // Simple validation
    if (!email || !password) {
      console.log("Login missing fields:", { email, password });
      return res.status(400).json({ message: "email and password are required" });
    }

    // Make sure DB/model is available
    if (!Admin || typeof Admin.findOne !== "function") {
      console.error("Admin model is not available or not exported correctly.");
      return res.status(500).json({ message: "Server configuration error (Admin model)" });
    }

    // Find user by email
    const user = await Admin.findOne({ email }).exec();
    if (!user) {
      console.log("Login failed — user not found for:", email);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Login failed — incorrect password for:", email);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Use env JWT secret (fallback to test string only)
    const jwtSecret = process.env.JWT_SECRET || "dev_jwt_secret_should_be_changed";
    const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: "1d" });

    // Success
    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin
      }
    });
  } catch (err) {
    console.error("Login error:", err && err.stack ? err.stack : err);
    // forward to global error handler or return generic 500
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
