import express from "express";
import { Song } from "./models/playlists.js";

const router = express.Router();

router.get("/list", async (req, res) => {
  try {
    const songs = await Song.find();
    res.status(200).json(songs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/test", (req, res) => {
  res.send("List route working ✅");
});
console.log("Fetched Songs:", Song);



export default router;
