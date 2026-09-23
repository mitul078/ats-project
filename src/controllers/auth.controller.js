import { loginUser } from "../services/auth.service.js"
import Auth from "../models/auth.model.js"

export async function login(req, res) {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password required" })
        }

        const { token, user } = await loginUser(email, password)
        res.status(200).json({ token, user })
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message || "Login failed" })
    }
}

export async function me(req, res) {
    try {
        const user = await Auth.findById(req.user.id).select("-password")
        if (!user) return res.status(404).json({ message: "User not found" })
        res.status(200).json({ user })
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch user" })
    }
}