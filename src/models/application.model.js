import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
    candidateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Auth",
        required: true
    },
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
        required: true
    },
    resumeUrl: { type: String, required: true },
    status: {
        type: String,
        enum: ["pending", "processing", "scored", "failed"],
        default: "pending"
    },
    parsedData: {
        skills: [{ type: String }],
        experienceYears: Number,
        education: String
    },
    aiScore: { type: Number, min: 0, max: 100 },
    aiSummary: String,
    failureReason: String
}, { timestamps: true })

applicationSchema.index({ candidateId: 1, jobId: 1 }, { unique: true })

const Application = mongoose.model("Application", applicationSchema)
export default Application