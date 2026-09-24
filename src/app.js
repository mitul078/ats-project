import os from "os"
import express from "express"
import authRoutes from "./routes/auth.route.js"
import jobRoutes from "./routes/job.route.js"
import applicationRoutes from "./routes/application.route.js"

const app = express()
app.use(express.json())


app.use("/api/auth", authRoutes)
app.use("/api/jobs", jobRoutes)
app.use("/api/applications", applicationRoutes)

app.get("/health", (req, res) => {
    res.send({ message: "ATS API RUNNING", status: "ok", hostname: os.hostname() })
})

export default app