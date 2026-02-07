import { createScan, type Scan } from "../model/scan.js"
import type { IScanRepository } from "../repositories/scan-repository.js"

export class ScanService {
    private _currentScanId: string | null
    private _scanRepo: IScanRepository

    constructor(scanRepository: IScanRepository) {
        this._scanRepo = scanRepository
        this._currentScanId = null
    }

    async newScan(directory: string): Promise<Scan> {
        if (this._currentScanId != null) {
            throw new Error("A scan is already in progress")
        }
        const scan = createScan(directory, "queued")
        await this._scanRepo.insert(scan)
        this._currentScanId = scan.id
        return {
            ...scan
        }
    }

    async getScan(scanId: string): Promise<Scan> {
        return await this._scanRepo.get(scanId)
    }

    async toRunningState(scanId: string): Promise<Scan> {
        if (this._currentScanId != scanId) {
            throw new Error("Only the current queued scan can transition")
        }
        const scan = await this.getScan(scanId)
        if (scan.status != "queued") {
            throw new Error("Only a queued scan can transition to running")
        }
        const now = new Date()
        const runningScan: Scan = {
            ...scan,
            status: "running",
            startedAt: now
        }
        await this._scanRepo.update(runningScan)
        return runningScan
    }

    async toCompleteState(scanId: string): Promise<Scan> {
        if (this._currentScanId != scanId) {
            throw new Error("Only the current running scan can transition")
        }
        const scan = await this.getScan(scanId)
        if (scan.status != "running") {
            throw new Error("Only a running scan can transition to complete")
        }
        const now = new Date()
        const completeScan: Scan = {
            ...scan,
            status: "complete",
            finishedAt: now
        }
        await this._scanRepo.update(completeScan)
        this._currentScanId = null
        return completeScan
    }

    async toErrorState(scanId: string, error: string): Promise<Scan> {
        if (this._currentScanId != scanId) {
            throw new Error("Only the current running scan can transition")
        }
        const scan = await this.getScan(scanId)
        if (scan.status != "running") {
            throw new Error("Only a running scan can transition to error")
        }
        const now = new Date()
        const completeScan: Scan = {
            ...scan,
            status: "error",
            error,
            finishedAt: now
        }
        await this._scanRepo.update(completeScan)
        this._currentScanId = null
        return completeScan
    }
}
