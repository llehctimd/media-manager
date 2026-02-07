import { type IScanRepository, MapScanRepository } from "./scan-repository.js"
import { createScan } from "../model/scan.js"

describe("MapScanRepository implementation", () => {
    let scanRepo: IScanRepository
    beforeEach(() => {
        scanRepo = new MapScanRepository()
    })

    afterEach(() => {})

    it("tests insert and get", async () => {
        const scan = createScan("path/to/file", "queued")
        await scanRepo.insert(scan)
        const sameScan = await scanRepo.get(scan.id)
        expect(scan).toEqual(sameScan)
    })

    it("tests get on non-existant id throws", async () => {
        await expect(scanRepo.get("non-existent")).rejects.toThrow(
            new Error(`No scan with id 'non-existent' exists in repository`)
        )
    })

    it("tests update scan", async () => {
        const scan = createScan("path/to/file", "queued")
        await scanRepo.insert(scan)
        scan.status = "error"
        scan.startedAt = new Date(1)
        scan.finishedAt = new Date(2)
        scan.error = "test string"
        await scanRepo.update(scan)
        const updatedScan = await scanRepo.get(scan.id)
        expect(scan).toEqual(updatedScan)
    })

    it("tests update on non-existant id throws", async () => {
        const scan = createScan("path/to/file", "complete")
        await expect(scanRepo.update(scan)).rejects.toThrow(
            new Error(`No scan with id '${scan.id}' exists in repository`)
        )
    })

    it("tests insert on already existing id throws", async () => {
        const scan = createScan("path/to/file", "queued")
        await expect(scanRepo.insert(scan)).resolves.not.toThrow()
        scan.status = "complete"
        await expect(scanRepo.insert(scan)).rejects.toThrow(
            new Error(`Scan with id '${scan.id}' already exists in repository`)
        )
    })
})
