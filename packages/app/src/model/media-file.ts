import { v7 as uuidv7 } from "uuid"

export interface MediaFile {
    id: string
    path: string
}

export function createMediaFile(path: string): MediaFile {
    return {
        id: uuidv7(),
        path,
    }
}
