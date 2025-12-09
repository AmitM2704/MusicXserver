import mongoose from "mongoose";
import { conn1 } from "../db.js";

const userSchema = new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true}
})


export const User = conn1.model("User",userSchema)