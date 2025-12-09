import {  mongoose} from "mongoose";
import { conn2 } from "../db.js";

// const songSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   artist: { type: String },
//   album: { type: String },
//   url: { type: String, required: true }, // Cloudinary URL
//   cloudinary_id: { type: String }        // Cloudinary public ID
// }, { timestamps: true });

// export const Song = conn2.model('Song', songSchema);

const songSchema = new mongoose.Schema({
  title: String,
  artist: String,
  album: String,
  songUrl: String,
  coverUrl: String,
  songId: String,
  coverId: String,
});

export const Song = conn2.model("Song", songSchema);
