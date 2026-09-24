import { connection } from "../queues/resume.queue.js"

const DEFAULT_TTL = 60 * 60 * 24 * 7

export async function getCache(key) {
    const value = await connection.get(key)
    if (!value) return null

    try {
        return JSON.parse(value)
    } catch {
        return null
    }

}

export async function setCache(key, value, ttlSecond = DEFAULT_TTL) {
    await connection.set(key, JSON.stringify(value), "EX", ttlSecond)
}