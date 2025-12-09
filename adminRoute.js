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
router.post('/login', async (req, res) => {
    console.log("Login body:", req.body);
    

  try {
    const { name,email, password } = req.body;

    // Find user by email
    const user = await Admin.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Create JWT token
    const token = jwt.sign({ id: user._id }, "ygjvhbku", { expiresIn: "1d" });
    

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.error("Login error:", err);

  }
});


export default router;
