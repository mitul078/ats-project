import { z } from "zod"

export const createJobSchema = z.object({
    title: z.string().min(3),
    description: z.string().min(10),
    requiredSkills: z.array(z.string()).min(1),
    experienceLevel: z.enum(["entry", "mid", "senior"]).optional(),
})