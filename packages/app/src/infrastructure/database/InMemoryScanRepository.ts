import { Scan } from "@/domain/scans/Scan.js"
import type { ScanRepository } from "@/domain/scans/ScanRepository.js"

type ScanData = {
    path: Scan["path"]
    status: Scan["status"]
    startedAt: Scan["startedAt"]
    finishedAt: Scan["finishedAt"]
}

export class InMemoryScanRepository implements ScanRepository {
    private _idToDataMap: Map<string, ScanData>

    constructor() {
        this._idToDataMap = new Map()
    }

    async findById(id: string): Promise<Scan | null> {
        const data = this._idToDataMap.get(id)
        if (data === undefined) {
            return null
        }
        return new Scan(
            id,
            data.path,
            data.status,
            data.startedAt,
            data.finishedAt
        )
    }

    async save(scan: Scan): Promise<void> {
        this._idToDataMap.set(scan.id, {
            path: scan.path,
            status: scan.status,
            startedAt: scan.startedAt,
            finishedAt: scan.finishedAt,
        })
    }
}
