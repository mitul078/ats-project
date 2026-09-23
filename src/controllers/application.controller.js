import { applySchema } from "../validators/application.validator.js"
import { createApplication, getApplicationById, listApplicationsByJob } from "../services/application.service.js"
import { resumeQueue } from "../queues/resume.queue.js"

export async function apply(req, res) {
    try {
        const parsed = applySchema.safeParse(req.body)
        if (!parsed.success) {
            return res.status(400).json({ message: "Invalid input", errors: parsed.error.issues })
        }

        if (!req.file) {
            return res.status(400).json({ message: "Resume file (PDF) is required" })
        }

        const application = await createApplication(req.user.id, parsed.data.jobId, req.file.path)

        await resumeQueue.add(
            "process-resume",
            { applicationId: application._id.toString() },
            {
                attempts: 3,
                backoff: { type: "exponential", delay: 5000 }
            }
        )

        res.status(201).json({
            message: "Application received. Resume is being processed.",
            application,
        })
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message || "Failed to submit application" })
    }
}

export async function getOne(req, res) {
    try {
        const application = await getApplicationById(req.params.id)
        res.status(200).json({ application })
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message || "Failed to fetch application" })
    }
}

export async function listForJob(req, res) {
    try {
        const applications = await listApplicationsByJob(req.params.jobId)
        res.status(200).json({ applications })
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch applications" })
    }
}