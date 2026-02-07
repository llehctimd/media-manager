import { v7 as uuidv7 } from "uuid"

export type ScanStatus = "queued" | "running" | "complete" | "error"

export interface Scan {
    readonly id: string
    path: string
    status: ScanStatus
    startedAt?: Date
    finishedAt?: Date
    error?: string
}

export function createScan(path: string, status: ScanStatus): Scan {
    return {
        id: uuidv7(),
        path,
        status,
    }
}
