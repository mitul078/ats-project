import { verifyToken } from "../utils/jwt.js"

export function protect(req, res, next) {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token provided" })
    }

    const token = authHeader.split(" ")[1]

    try {
        req.user = verifyToken(token)
        next()
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" })
    }
}