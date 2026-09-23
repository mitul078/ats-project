import Job from "../models/job.model.js"

export async function createJob(data, recruiterId) {
    return Job.create({ ...data, recruiterId })
}

export async function listJobs(filter = {}) {
    return Job.find(filter).sort({ createdAt: -1 })
}

export async function getJobById(id) {
    const job = await Job.findById(id)
    if (!job) {
        const err = new Error("Job not found")
        err.statusCode = 404
        throw err
    }
    return job
}