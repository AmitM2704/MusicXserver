
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {User} from "..//models/usermodel.js";




export const login = async (req, res) => {
  try {
    const { name,email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, "srhbferyilsjkhgnsrluixkg", { expiresIn: "1d" });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// // Assuming you got this from your login API
// const response = await fetch('/api/login', {
//   method: 'POST',
//   headers: { 'Content-Type': 'application/json' },
//   body: JSON.stringify({ email, password })
// });

// const data = await response.json();
// if (data.token) {
//   // Save token in localStorage
//   localStorage.setItem('token', data.token);

//   // Optionally save user info
//   localStorage.setItem('user', JSON.stringify(data.user));
// }
