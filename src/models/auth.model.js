import mongoose from "mongoose";

const authSchema = new mongoose.Schema({
    email: String,
    password: String,
    role: { type: String, enum: ["recruiter", "candidate"], default: "candidate" }
})

const Auth = mongoose.model("Auth", authSchema)

export default Auth