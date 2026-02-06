import { v7 as uuidv7 } from "uuid"

type ScanStatus = "queued" | "running" | "complete" | "error"

export interface Scan {
    readonly id: string
    status: ScanStatus
    startedAt?: Date
    finishedAt?: Date
    error?: string
}

export function createScan(status: ScanStatus): Scan {
    return {
        id: uuidv7(),
        status,
    }
}
