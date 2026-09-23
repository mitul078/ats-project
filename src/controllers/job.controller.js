import { createJobSchema } from "../validators/job.validator.js"
import { createJob, listJobs, getJobById } from "../services/job.service.js"

export async function create(req, res) {
    try {
        const parsed = createJobSchema.safeParse(req.body)
        if (!parsed.success) {
            return res.status(400).json({ message: "Invalid input", errors: parsed.error.issues })
        }

        const job = await createJob(parsed.data, req.user.id)
        res.status(201).json({ job })
    } catch (error) {
        res.status(500).json({ message: "Failed to create job" })
    }
}

export async function list(req, res) {
    try {
        const jobs = await listJobs({ status: "open" })
        res.status(200).json({ jobs })
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch jobs" })
    }
}

export async function getOne(req, res) {
    try {
        const job = await getJobById(req.params.id)
        res.status(200).json({ job })
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message || "Failed to fetch job" })
    }
}