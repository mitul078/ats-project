import { createJobSchema } from "../../validators/job.validator.js"

describe("createJobSchema", () => {
    const validJob = {
        title: "Backend Engineer",
        description: "Node.js backend role, Express and MongoDB experience required.",
        requiredSkills: ["Node.js", "Express", "MongoDB"],
        experienceLevel: "mid",
    }

    it("should pass with valid job data", () => {
        const result = createJobSchema.safeParse(validJob)
        expect(result.success).toBe(true)
    })

    it("should pass without experienceLevel (optional field)", () => {
        const { experienceLevel, ...rest } = validJob
        const result = createJobSchema.safeParse(rest)
        expect(result.success).toBe(true)
    })

    it("should fail when title is too short", () => {
        const result = createJobSchema.safeParse({ ...validJob, title: "Go" })
        expect(result.success).toBe(false)
    })

    it("should fail when description is too short", () => {
        const result = createJobSchema.safeParse({ ...validJob, description: "short" })
        expect(result.success).toBe(false)
    })

    it("should fail when requiredSkills is empty", () => {
        const result = createJobSchema.safeParse({ ...validJob, requiredSkills: [] })
        expect(result.success).toBe(false)
    })

    it("should fail when requiredSkills is missing", () => {
        const { requiredSkills, ...rest } = validJob
        const result = createJobSchema.safeParse(rest)
        expect(result.success).toBe(false)
    })

    it("should fail with an invalid experienceLevel value", () => {
        const result = createJobSchema.safeParse({ ...validJob, experienceLevel: "expert" })
        expect(result.success).toBe(false)
    })
})