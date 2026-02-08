interface QueuedScan {
    id: string
    path: string
    status: "queued"
}

interface RunningScan {
    id: string
    path: string
    status: "running"
    startedAt: Date
}

interface CompletedScan {
    id: string
    path: string
    status: "completed"
    startedAt: Date
    finishedAt: Date
}

export type Scan = QueuedScan | RunningScan | CompletedScan

export async function queueScan(path: string): Promise<Scan> {
    const res = await fetch("/api/v1/scans", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            path: path,
        }),
    })
    const json = await res.json()
    if (json.error !== undefined) {
        throw new Error(json.error)
    }
    switch (json.status) {
        case "queued":
            return { id: json.id, path: json.path, status: "queued" }
        case "running":
            return {
                id: json.id,
                path: json.path,
                status: "running",
                startedAt: new Date(json.startedAt),
            }
        case "completed":
            return {
                id: json.id,
                path: json.path,
                status: "completed",
                startedAt: new Date(json.startedAt),
                finishedAt: new Date(json.finishedAt)
            }
        default:
            throw new Error("Invalid response")
    }
}

export async function getScan(id: string): Promise<Scan> {
    const res = await fetch(`/api/v1/scans/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    })
    const json = await res.json()
    if (json.error !== undefined) {
        throw new Error(json.error)
    }
    switch (json.status) {
        case "queued":
            return { id: json.id, path: json.path, status: "queued" }
        case "running":
            return {
                id: json.id,
                path: json.path,
                status: "running",
                startedAt: new Date(json.startedAt),
            }
        case "completed":
            return {
                id: json.id,
                path: json.path,
                status: "completed",
                startedAt: new Date(json.startedAt),
                finishedAt: new Date(json.finishedAt)
            }
        default:
            throw new Error("Invalid response")
    }
}