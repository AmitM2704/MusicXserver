import express from "express";
import { signup } from "./controllers/signup.js";
import { login } from "./controllers/login.js";

//import { listSong } from "./controllers/playlist.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
//router.post("/add" , addSong);
//router.get("/list",listSong);

export default router;
