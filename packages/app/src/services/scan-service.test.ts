import { jest } from "@jest/globals"
import type { Scan } from "../model/scan.js"
import { ScanService } from "./scan-service.js"
import { MapScanRepository, type IScanRepository } from "../repositories/scan-repository.js"

describe("ScanService", () => {
    let scanService: ScanService
    let scanRepository: IScanRepository

    beforeEach(async () => {
        jest.useFakeTimers()
        scanRepository = new MapScanRepository()
        scanService = new ScanService(scanRepository)
    })

    afterEach(async () => {
        jest.useRealTimers()
    })

    it("tests new scan created with queued state", async () => {
        const path = "path/to/dir"
        const scan = await scanService.newScan(path)
        const queuedScan = await scanService.getScan(scan.id)
        expect(queuedScan).toEqual<Scan>({
            id: scan.id,
            path: path,
            status: "queued",
        })
        expect(scan).toEqual<Scan>(queuedScan)
        await expect(scanService.toCompleteState(queuedScan.id)).rejects.toThrow()
        await expect(scanService.toErrorState(queuedScan.id, "error message")).rejects.toThrow()
    })

    it("tests new scan cannot be created with an already queued scan", async () => {
        await scanService.newScan("path/to/dir")
        await expect(scanService.newScan("path/to/other/dir")).rejects.toThrow()
    })

    it("tests queued scan to running state", async () => {
        const path = "path/to/dir"
        const scan = await scanService.newScan(path)
        const startedAt = new Date(1)
        jest.setSystemTime(startedAt)
        await scanService.toRunningState(scan.id)
        const runningScan = await scanService.getScan(scan.id) 
        expect(runningScan).toEqual<Scan>({
            id: scan.id,
            path,
            status: "running",
            startedAt,
        })
        await expect(scanService.toRunningState(runningScan.id)).rejects.toThrow()
    })

    it("tests new scan cannot be created with an already running scan", async () => {
        const scan = await scanService.newScan("path/to/dir")
        await scanService.toRunningState(scan.id)
        await expect(scanService.newScan("path/to/other/dir")).rejects.toThrow()
    })

    it("tests running scan to completed state", async () => {
        const path = "path/to/dir"
        const scan = await scanService.newScan(path)
        const startedAt = new Date(1)
        jest.setSystemTime(startedAt)
        await scanService.toRunningState(scan.id)
        const finishedAt = new Date(2)
        jest.setSystemTime(finishedAt)
        await scanService.toCompleteState(scan.id)
        const completedScan = await scanService.getScan(scan.id)
        expect(completedScan).toEqual<Scan>({
            id: scan.id,
            path,
            status: "complete",
            startedAt,
            finishedAt,
        })
        await expect(
            scanService.toRunningState(completedScan.id)
        ).rejects.toThrow()
        await expect(
            scanService.toCompleteState(completedScan.id)
        ).rejects.toThrow()
        await expect(
            scanService.toErrorState(completedScan.id, "error message")
        ).rejects.toThrow()
    })

    it("tests running scan to error state", async () => {
        const path = "path/to/dir"
        const scan = await scanService.newScan(path)
        const startedAt = new Date(1)
        jest.setSystemTime(startedAt)
        await scanService.toRunningState(scan.id)
        const finishedAt = new Date(2)
        jest.setSystemTime(finishedAt)
        await scanService.toErrorState(
            scan.id,
            "error message"
        )
        const errorScan = await scanService.getScan(scan.id)
        expect(errorScan).toEqual<Scan>({
            id: scan.id,
            path,
            status: "error",
            error: "error message",
            startedAt,
            finishedAt,
        })
        await expect(
            scanService.toRunningState(errorScan.id)
        ).rejects.toThrow()
        await expect(
            scanService.toCompleteState(errorScan.id)
        ).rejects.toThrow()
        await expect(
            scanService.toErrorState(errorScan.id, "error message")
        ).rejects.toThrow()
    })

    it("tests can start a second scan after first completes", async () => {
        const path = "path/to/dir"
        const scan1 = await scanService.newScan(path)
        await expect(scanService.newScan("path/to/another/dir")).rejects.toThrow()
        const startedAt = new Date(1)
        jest.setSystemTime(startedAt)
        await scanService.toRunningState(scan1.id)
        await expect(scanService.newScan("path/to/another/dir")).rejects.toThrow()
        const finishedAt = new Date(2)
        jest.setSystemTime(finishedAt)
        await scanService.toCompleteState(scan1.id)
        await scanService.newScan("path/to/another/dir")
    })

    it("tests can start a second scan after first errors", async () => {
        const path = "path/to/dir"
        const scan1 = await scanService.newScan(path)
        await expect(scanService.newScan("path/to/another/dir")).rejects.toThrow()
        const startedAt = new Date(1)
        jest.setSystemTime(startedAt)
        await scanService.toRunningState(scan1.id)
        await expect(scanService.newScan("path/to/another/dir")).rejects.toThrow()
        const finishedAt = new Date(2)
        jest.setSystemTime(finishedAt)
        await scanService.toErrorState(scan1.id, "error message")
        await scanService.newScan("path/to/another/dir")
    })
})
