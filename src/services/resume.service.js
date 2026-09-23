import fs from "fs"
import { PDFParse } from "pdf-parse"

export async function extractTextFromPdf(filePath) {
    const dataBuffer = fs.readFileSync(filePath)
    const parser = new PDFParse({ data: dataBuffer })

    try {
        const result = await parser.getText()
        return result.text
    } finally {
        await parser.destroy()
    }
}