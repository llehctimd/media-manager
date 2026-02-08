export type MediaFile = {
    id: string
    path: string
    scanId: string
}

export async function getMediaFiles(): Promise<MediaFile[]> {
    const res = await fetch(`/api/v1/media-files`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
    const json = await res.json()
    if (!Array.isArray(json)) {
        if (typeof json.error === "string") {
            throw new Error(json.error)
        } else {
            throw new Error("Unknown error getting media files")
        }
    }
    return json as MediaFile[]
}
