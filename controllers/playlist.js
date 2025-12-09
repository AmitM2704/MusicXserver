// routes/playlist.js
// import express from "express";
// import Playlist from "..//models/playlists.js";
// import { Token } from "../.env";

import { Song } from "../models/playlists.js";
//const addSong = async(req,res) => {}

const listSong = async(req,res) => {
    try{
        const data = await Song.find()
        res.status(200).json(data)
    }
    catch(error){
        console.log("error fetching songs",error);
        res.status(500).json({ message: "Failed to fetch songs", error });

    }
}

export{listSong}

//export default router;
