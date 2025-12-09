import express from "express";
import {Song} from "./models/playlists.js";

const router = express.Router();


router.get("/songs", async (req, res) => {
  try {
    const songs = await Song.find(); 
    res.json(songs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch songs" });
  }
});

export default router;
