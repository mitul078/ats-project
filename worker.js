import "dotenv/config"
import { Worker } from "bullmq"
import { connection } from "./src/queues/resume.queue.js"
import connectDB from "./src/config/db.js"
import Application from "./src/models/application.model.js"
import Job from "./src/models/job.model.js"
import { extractTextFromPdf } from "./src/services/resume.service.js"
import { extractResumeData, scoreResumeAgainstJob } from "./src/services/ai.service.js"

await connectDB()

const worker = new Worker(
    "resume-processing",
    async (job) => {
        const { applicationId } = job.data

        const application = await Application.findById(applicationId)
        if (!application) throw new Error("Application not found")

        application.status = "processing"
        await application.save()

        const jobPosting = await Job.findById(application.jobId)
        if (!jobPosting) throw new Error("Job posting not found")

        const resumeText = await extractTextFromPdf(application.resumeUrl)

        const parsedData = await extractResumeData(resumeText)
        const { score, summary } = await scoreResumeAgainstJob(resumeText, jobPosting)

        application.parsedData = parsedData
        application.aiScore = score
        application.aiSummary = summary
        application.status = "scored"
        await application.save()

        return { applicationId, score }
    },
    { connection, concurrency: 2 }
)

worker.on("completed", (job, result) => {
    console.log(`APPLICATION ${result.applicationId} SCORED: ${result.score}`)
})

worker.on("failed", async (job, err) => {
    console.log(`JOB ${job.id} FAILED:`, err.message)

    if (job.attemptsMade >= job.opts.attempts) {
        const { applicationId } = job.data
        await Application.findByIdAndUpdate(applicationId, {
            status: "failed",
            failureReason: err.message,
        })
    }
})

console.log("RESUME WORKER STARTED")