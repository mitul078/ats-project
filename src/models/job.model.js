import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    requiredSkills: [{ type: String }],
    experienceLevel: {
        type: String,
        enum: ["entry", "mid", "senior"],
        default: "mid"
    },
    recruiterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Auth",
        required: true
    },
    status: {
        type: String,
        enum: ["open", "closed"],
        default: "open"
    }
}, { timestamps: true })

const Job = mongoose.model("Job", jobSchema)
export default Job