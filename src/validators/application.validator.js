import { z } from "zod"
import mongoose from "mongoose"

export const applySchema = z.object({
    jobId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
        message: "Invalid jobId",
    }),
})