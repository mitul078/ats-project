import { Queue } from "bullmq"
import IORedis from "ioredis"


export const connection = new IORedis(process.env.REDIS_URI, {
    maxRetriesPerRequest: null
})

export const resumeQueue = new Queue("resume-processing", { connection })