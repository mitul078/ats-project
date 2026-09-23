import Groq from "groq-sdk"

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

async function callWithRetry(fn, retries = 3, delayMs = 2000) {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            return await fn()
        } catch (err) {
            const isRetryable = err.status === 503 || err.status === 429
            if (isRetryable && attempt < retries) {
                console.log(`Attempt ${attempt} failed (rate limited/busy). Retrying in ${delayMs / 1000}s...`)
                await new Promise((res) => setTimeout(res, delayMs))
                delayMs *= 2
            } else {
                throw err
            }
        }
    }
}

async function callGroq(prompt) {
    const response = await callWithRetry(() =>
        groq.chat.completions.create({
            model: "openai/gpt-oss-120b",
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" },
        })
    )

    const rawText = response.choices[0]?.message?.content
    if (!rawText) throw new Error("Groq returned no content")

    let parsed
    try {
        parsed = JSON.parse(rawText)
    } catch (err) {
        throw new Error("AI returned invalid JSON: " + err.message)
    }

    return parsed
}

export async function extractResumeData(resumeText) {
    const prompt = `
You are a resume parser. Extract structured data from the resume text below.

Return ONLY valid JSON matching this exact structure, with no markdown formatting, no code fences, and no explanation text before or after:

{
  "skills": ["string"],
  "experienceYears": number,
  "education": "string (highest degree and field)"
}

Resume text:
${resumeText.slice(0, 8000)}
`
    return callGroq(prompt)
}

export async function scoreResumeAgainstJob(resumeText, job) {
    const prompt = `
You are an ATS scoring engine. Compare the resume against the job description and score the candidate's fit.

Job title: ${job.title}
Job description: ${job.description}
Required skills: ${job.requiredSkills.join(", ")}

Resume text:
${resumeText.slice(0, 8000)}

Return ONLY valid JSON matching this exact structure, with no markdown formatting, no code fences, and no explanation text before or after:

{
  "score": number,
  "summary": "string (2-3 sentence explanation of the fit)"
}

The "score" must be an integer between 0 and 100.
`
    return callGroq(prompt)
}