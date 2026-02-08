import { v7 as uuidv7 } from "uuid"

export type ScanStatus = "queued" | "running" | "completed"

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
}
