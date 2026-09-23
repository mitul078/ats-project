import { Router } from "express"
import { apply, getOne, listForJob } from "../controllers/application.controller.js"
import { protect } from "../middlewares/auth.middleware.js"
import { requireRole } from "../middlewares/role.middleware.js"
import upload from "../config/multer.js"

const router = Router()

router.post("/", protect, requireRole("candidate"), upload.single("resume"), apply)
router.get("/:id", protect, getOne)
router.get("/job/:jobId", protect, requireRole("recruiter"), listForJob)

export default router