import express from "express";
import multer from "multer";
import fs from "fs";
import cloudinary from "./cloudin.js";
import { Song } from "./models/playlists.js";

const router = express.Router();

// Multer storage — store in uploads/ temporarily
const upload = multer({ dest: "uploads/" });

router.post(
  "/upload-song",
  upload.fields([
    { name: "song", maxCount: 1 },
    { name: "cover", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { title, artist, album } = req.body;
      console.log("Incoming files:", req.files);

      // ✅ Validate uploads
      if (!req.files || !req.files.song || !req.files.cover) {
        return res.status(400).json({ error: "Both song and cover are required" });
      }

      const songPath = req.files.song[0].path;
      const coverPath = req.files.cover[0].path;

        const songResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_large(
            songPath,
            { resource_type: "video", folder: "songs" },
            (error, result) => {
            if (error) reject(error);
            else resolve(result);
            }
        );
        });

//console.log("Full Cloudinary song upload result:", songResult);


console.log("Full Cloudinary song upload result:", songResult);

      //console.log(songResult.secure_url)

      const coverResult = await cloudinary.uploader.upload(coverPath, {
        resource_type: "image",
        folder: "covers",
      });

          const newSong = new Song({
            title,
            artist,
            album,
            songUrl: songResult.secure_url,
            coverUrl: coverResult.secure_url,
            songId: songResult.public_id,
            coverId: coverResult.public_id,
    });

    await newSong.save(); // 👈 Save to MongoDB

      // ✅ Clean temp files
      fs.unlinkSync(songPath);
      fs.unlinkSync(coverPath);

      res.status(200).json({
        message: "Song uploaded successfully!",
        data: {
          title,
          artist,
          album,
          songUrl: songResult.secure_url,
          coverUrl: coverResult.secure_url,
        },
      });
    } catch (error) {
      console.error("Cloudinary upload failed:", error);
      res.status(500).json({ error: "Upload failed", details: error.message });
    }
  }
);
router.delete("/delete-song/:id", async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) return res.status(404).json({ error: "Song not found" });

    // 🗑 Delete from Cloudinary
    await cloudinary.uploader.destroy(song.songId, { resource_type: "video" });
    await cloudinary.uploader.destroy(song.coverId, { resource_type: "image" });

    // 🗑 Delete from MongoDB
    await Song.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Song deleted successfully!" });
  } catch (error) {
    console.error("Delete failed:", error);
    res.status(500).json({ error: "Failed to delete song", details: error.message });
  }
});


export default router;
