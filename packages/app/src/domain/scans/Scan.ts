import { v7 as uuidv7 } from "uuid"

export type ScanStatus = "queued" | "running" | "completed"

interface ScanDTO {
    id: string,
    path: string,
    status: string,
    startedAt: string | null,
    finishedAt: string | null
}

export class Scan {
    constructor(
        public id: string,
        public path: string,
        public status: ScanStatus,
        public startedAt: Date | null,
        public finishedAt: Date | null
    ) {}

    static create(path: string) {
        return new Scan(uuidv7(), path, "queued", null, null)
    }

    run(startedAt: Date) {
        if (this.status != "queued") {
            throw new Error("Only a queued scan enter running state")
        }
        this.status = "running"
        this.startedAt = startedAt
    }

    complete(finishedAt: Date) {
        if (this.status != "running") {
            throw new Error("Only a running scan can enter completed state")
        }
        this.status = "completed"
        this.finishedAt = finishedAt
    }

    clone(): Scan {
        return new Scan(
            this.id,
            this.path,
            this.status,
            this.startedAt ? new Date(this.startedAt) : null,
            this.finishedAt ? new Date(this.finishedAt) : null
        )
    }

    toJSON(): ScanDTO {
        return {
            id: this.id,
            path: this.path,
            status: this.status,
            startedAt: this.startedAt?.toISOString() ?? null,
            finishedAt: this.finishedAt?.toISOString() ?? null
        }
    }
}
