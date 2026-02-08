import { Scan } from "@/domain/scans/Scan.js"
import { InMemoryScanRepository } from "@/infrastructure/database/InMemoryScanRepository.js"

function isScanEqual(left: Scan, right: Scan): boolean {
    return (
        left.id === right.id &&
        left.path === right.path &&
        left.status === right.status &&
        left.startedAt === right.startedAt &&
        left.finishedAt === right.finishedAt
    )
}

describe("Test in-memory implementation of MediaFileRespository", () => {
    let scanRepo: InMemoryScanRepository

    beforeEach(async () => {
        scanRepo = new InMemoryScanRepository()
    })

    afterEach(async () => {})

    it("tests save and find by id method", async () => {
        const scan = new Scan(
            "id-1",
            "path/to/dir/",
            "completed",
            new Date(1),
            new Date(2)
        )
        await scanRepo.save(scan)

        const foundScan = await scanRepo.findById(scan.id)
        expect(foundScan).not.toBeNull()
        expect(isScanEqual(scan, foundScan!)).toBe(true)

        const notFoundScan = await scanRepo.findById("id-2")
        expect(notFoundScan).toBeNull()
    })

    it("tests mutation of domain object doesn't mutate stored entity", async () => {
        const initialId = "id-1"
        const initialPath = "path/to/file1"
        const initialStatus = "queued"
        const initialStartedAt = new Date(1)
        const initialFinishedAt = new Date(2)
        const scan = new Scan(
            initialId,
            initialPath,
            initialStatus,
            initialStartedAt,
            initialFinishedAt
        )
        await scanRepo.save(scan)

        scan.id = "id-2"
        scan.path = "path/to/file2"
        scan.status = "queued"
        scan.startedAt = new Date(3)
        scan.finishedAt = new Date(4)
        const storedScan = await scanRepo.findById(initialId)

        expect(storedScan?.id).toBe(initialId)
        expect(storedScan?.path).toBe(initialPath)
        expect(storedScan?.status).toBe(initialStatus)
        expect(storedScan?.startedAt).toBe(initialStartedAt)
        expect(storedScan?.finishedAt).toBe(initialFinishedAt)
    })
})
