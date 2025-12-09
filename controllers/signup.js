import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {User} from "../models/usermodel.js";

export const signup = async (req, res) => {
  try {
    const { email, password } = req.body;
   // console.log(req.body)
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({email, password: hashedPassword });

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};