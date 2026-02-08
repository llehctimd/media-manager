import { v7 as uuidv7 } from "uuid"

export type ScanStatus = "queued" | "running" | "completed" | "error"

interface ScanDTO {
    id: string,
    path: string,
    status: string,
    startedAt: string | null,
    finishedAt: string | null
    error: string | null
}

export class Scan {
    constructor(
        public id: string,
        public path: string,
        public status: ScanStatus,
        public startedAt: Date | null,
        public finishedAt: Date | null,
        public error: string | null
    ) {}

    static create(path: string) {
        return new Scan(uuidv7(), path, "queued", null, null, null)
    }

    toRun(startedAt: Date) {
        if (this.status !== "queued") {
            throw new Error("Only a queued scan enter running state")
        }
        this.status = "running"
        this.startedAt = startedAt
    }

    toComplete(finishedAt: Date) {
        if (this.status !== "running") {
            throw new Error("Only a running scan can enter completed state")
        }
        this.status = "completed"
        this.finishedAt = finishedAt
    }

    toError(finishedAt: Date, message: string) {
        if (this.status !== "running") {
            throw new Error("Only a running scan can enter error state")
        }
        this.status = "error"
        this.finishedAt = finishedAt
        this.error = message
    }

    clone(): Scan {
        return new Scan(
            this.id,
            this.path,
            this.status,
            this.startedAt ? new Date(this.startedAt) : null,
            this.finishedAt ? new Date(this.finishedAt) : null,
            this.error
        )
    }

    toJSON(): ScanDTO {
        return {
            id: this.id,
            path: this.path,
            status: this.status,
            startedAt: this.startedAt?.toISOString() ?? null,
            finishedAt: this.finishedAt?.toISOString() ?? null,
            error: this.error
        }
    }
}
