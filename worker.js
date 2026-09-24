import "dotenv/config"
import fs from "fs"
import { Worker } from "bullmq"
import { connection } from "./src/queues/resume.queue.js"
import connectDB from "./src/config/db.js"
import Application from "./src/models/application.model.js"
import Job from "./src/models/job.model.js"
import { extractTextFromPdf } from "./src/services/resume.service.js"
import { extractResumeData, scoreResumeAgainstJob } from "./src/services/ai.service.js"
import { getCache, setCache } from "./src/services/cache.service.js"
import { cacheHash } from "./src/utils/hash.js"


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

        const fileBuffer = fs.readFileSync(application.resumeUrl)
        const resumeHash = cacheHash(fileBuffer)

        const resumeText = await extractTextFromPdf(application.resumeUrl)

        const extractCacheKey = `resume:extract:${resumeHash}`
        let parsedData = await getCache(extractCacheKey)
        if (parsedData) {
            console.log(`CACHE HIT: parsed data for resume ${resumeHash}`)
        } else {
            parsedData = await extractResumeData(resumeText)
            await setCache(extractCacheKey, parsedData)
        }


        const scoreCacheKey = `resume:score:${resumeHash}:${application.jobId}`
        let scoreResult = await getCache(scoreCacheKey)
        if (scoreResult) {
            console.log(`CACHE HIT: score for resume ${resumeHash} on job ${application.jobId}`)
        } else {
            scoreResult = await scoreResumeAgainstJob(resumeText, jobPosting)
            await setCache(scoreCacheKey, scoreResult)
        }

        application.parsedData = parsedData
        application.aiScore = scoreResult.score
        application.aiSummary = scoreResult.summary
        application.status = "scored"
        await application.save()

        return { applicationId, score: scoreResult.score }
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