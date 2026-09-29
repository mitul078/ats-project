async function publishEvent(payload) {
    try {

        const response = await fetch(`${process.env.NOTIFY_SERVICE_URL}/api/internal/events`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "x-internal-key": process.env.INTERNAL_API_KEY
            },
            body: JSON.stringify(payload)
        })

        if (!response.ok) {
            console.log("NOTIFY SERVICE REJECTED EVENT:", response.status, await response.text())
        }

    } catch (error) {
        console.log("NOTIFY SERVICE UNREACHABLE:", err.message)
    }
}

export default { publishEvent }