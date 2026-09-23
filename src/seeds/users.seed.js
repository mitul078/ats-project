import "dotenv/config"
import mongoose from "mongoose"
import bcrypt from "bcryptjs"
import connectDB from "../config/db.js"
import Auth from "../models/auth.model.js"

const users = [
    { email: "recruiter@ats.com", password: "Recruiter@123", role: "recruiter" },
    { email: "candidate@ats.com", password: "Candidate@123", role: "candidate" },
]

async function seed() {
    await connectDB()

    await Auth.deleteMany({ email: { $in: users.map((u) => u.email) } })

    for (const user of users) {
        const hashedPassword = await bcrypt.hash(user.password, 10)
        await Auth.create({ ...user, password: hashedPassword })
        console.log(`Seeded ${user.role}: ${user.email} / ${user.password}`)
    }

    await mongoose.disconnect()
    process.exit(0)
}

seed().catch((err) => {
    console.error("SEED FAILED", err)
    process.exit(1)
})