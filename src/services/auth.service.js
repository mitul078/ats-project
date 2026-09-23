import bcrypt from "bcryptjs"
import Auth from "../models/auth.model.js"
import { signToken } from "../utils/jwt.js"

export async function loginUser(email, password) {
    const user = await Auth.findOne({ email })
    if (!user) {
        const err = new Error("Invalid credentials")
        err.statusCode = 401
        throw err
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        const err = new Error("Invalid credentials")
        err.statusCode = 401
        throw err
    }

    const token = signToken({ id: user._id, role: user.role })

    return {
        token,
        user: { id: user._id, email: user.email, role: user.role },
    }
}