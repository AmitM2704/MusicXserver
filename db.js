import mongoose from "mongoose";


    export const conn1 = await mongoose.createConnection("mongodb+srv://amitmukherjeeam2704_db_user:Arka1234@cluster0.2z3pfim.mongodb.net/user?retryWrites=true&w=majority&appName=Cluster0")
    console.log("user database connected!")
  
export const conn_ad = await mongoose.createConnection("mongodb+srv://amitmukherjeeam2704_db_user:Arka1234@cluster0.2z3pfim.mongodb.net/admins?retryWrites=true&w=majority&appName=Cluster0")
    console.log("admin database connected!")
  


    export const conn2 = await mongoose.createConnection("mongodb+srv://amitmukherjeeam2704_db_user:Arka1234@cluster0.2z3pfim.mongodb.net/tracks?retryWrites=true&w=majority&appName=Cluster0")
    console.log("tracks database connected!")

conn1.on("connected", () => console.log("Database 1[user] connected"));
conn2.on("connected", () => console.log("Database 2[tracks] connected"));
conn_ad.on("connected", () => console.log("Database[admins] connected"));



