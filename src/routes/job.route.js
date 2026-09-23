import { Router } from "express"
import { create, list, getOne } from "../controllers/job.controller.js"
import { protect } from "../middlewares/auth.middleware.js"
import { requireRole } from "../middlewares/role.middleware.js"

const router = Router()

router.post("/", protect, requireRole("recruiter"), create)
router.get("/", protect, list)
router.get("/:id", protect, getOne)

export default router