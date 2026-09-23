import Application from "../models/application.model.js"
import Job from "../models/job.model.js"

export async function createApplication(candidateId, jobId, resumeUrl) {
    const job = await Job.findById(jobId)
    if (!job) {
        const err = new Error("Job not found")
        err.statusCode = 404
        throw err
    }

    const existing = await Application.findOne({ candidateId, jobId })
    if (existing) {
        const err = new Error("You have already applied to this job")
        err.statusCode = 409
        throw err
    }

    return Application.create({ candidateId, jobId, resumeUrl, status: "pending" })
}

export async function getApplicationById(id) {
    const application = await Application.findById(id)
    if (!application) {
        const err = new Error("Application not found")
        err.statusCode = 404
        throw err
    }
    return application
}

export async function listApplicationsByJob(jobId) {
    return Application.find({ jobId }).sort({ aiScore: -1, createdAt: -1 })
}