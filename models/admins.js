import mongoose from "mongoose";
import { conn_ad } from "../db.js";

const userSchema = new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true}
})


export const Admin = conn_ad.model("Admin",userSchema)