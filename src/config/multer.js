import multer from "multer"
import path from "path"
import fs from "fs"

const uploadDir = "uploads"
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${req.user.id}${path.extname(file.originalname)}`
        cb(null, uniqueName)
    },
})

function fileFilter(req, file, cb) {
    if (file.mimetype !== "application/pdf") {
        return cb(new Error("Only PDF files are allowed"))
    }
    cb(null, true)
}

const maxSizeMb = Number(process.env.MAX_FILE_SIZE_MB || 5)

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: maxSizeMb * 1024 * 1024 },
})

export default upload