import mongoose from "mongoose";


const connectDBplay = async () => {
  try {
    const conn = await mongoose.connect("mongodb+srv://amitmukherjeeam2704_db_user:Arka1234@cluster0.2z3pfim.mongodb.net/tracks?retryWrites=true&w=majority&appName=Cluster0")
    console.log("tracks database connected!")
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

export default connectDBplay;