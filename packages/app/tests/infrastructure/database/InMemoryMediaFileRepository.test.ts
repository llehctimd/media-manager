import { MediaFile } from "@/domain/media-files/MediaFile.js"
import { InMemoryMediaFileRepository } from "@/infrastructure/database/InMemoryMediaFileRepository.js"

function isMediaFileEqual(left: MediaFile, right: MediaFile): boolean {
    return (
        left.id === right.id &&
        left.path === right.path &&
        left.scanId === right.scanId
    )
}

describe("Test in-memory implementation of MediaFileRespository", () => {
    let mediaFileRepo: InMemoryMediaFileRepository

    beforeEach(async () => {
        mediaFileRepo = new InMemoryMediaFileRepository()
    })

    afterEach(async () => {})

    it("tests save and find by id method", async () => {
        const mf = new MediaFile("id-1", "path/to/file1", "scan-1")
        await mediaFileRepo.save(mf)

        const foundMf = await mediaFileRepo.findById(mf.id)
        expect(foundMf).not.toBeNull()
        expect(isMediaFileEqual(mf, foundMf!)).toBe(true)

        const notFoundMf = await mediaFileRepo.findById("id-2")
        expect(notFoundMf).toBeNull()
    })

    it("tests save and find by path method", async () => {
        const mf = new MediaFile("id-1", "path/to/file1", "scan-1")
        await mediaFileRepo.save(mf)

        const foundMf = await mediaFileRepo.findByPath(mf.path)
        expect(foundMf).not.toBeNull()
        expect(isMediaFileEqual(mf, foundMf!)).toBe(true)

        const notFoundMf = await mediaFileRepo.findByPath("path/to/file2")
        expect(notFoundMf).toBeNull()
    })

    it("tests unique path constraint", async () => {
        const mf1 = new MediaFile("id-1", "path/to/file1", "scan-1")
        const mf2 = new MediaFile("id-2", "path/to/file1", "scan-1")

        await mediaFileRepo.save(mf1)
        await expect(mediaFileRepo.save(mf2)).rejects.toThrow(/unique/i)

        const mf3 = new MediaFile("id-3", "path/to/file2", "scan-1")
        await mediaFileRepo.save(mf3)

        mf3.path = mf1.path
        await expect(mediaFileRepo.save(mf3)).rejects.toThrow(/unique/i)
    })

    it("tests delete no scan id method", async () => {
        const mf1 = new MediaFile("id-1", "path/to/file1", "scan-1")
        const mf2 = new MediaFile("id-2", "path/to/file2", "scan-2")

        await mediaFileRepo.save(mf1)
        await mediaFileRepo.save(mf2)

        const count = await mediaFileRepo.deleteNotScanId("scan-2")
        expect(count).toBe(1)
        const notFoundMf1 = await mediaFileRepo.findById("id-1")
        const foundMf2 = await mediaFileRepo.findById("id-2")

        expect(notFoundMf1).toBeNull()
        expect(foundMf2).not.toBeNull()

        expect(isMediaFileEqual(mf2, foundMf2!)).toBe(true)
    })

    it("tests mutation of domain object doesn't mutate stored entity", async () => {
        const initialId = "id-1"
        const initialPath = "path/to/file1"
        const initialScan = "scan-1"
        const mf = new MediaFile(initialId, initialPath, initialScan)
        await mediaFileRepo.save(mf)

        mf.id = "id-2"
        mf.path = "path/to/file2"
        mf.scanId = "scan-2"

        const storedMf = await mediaFileRepo.findById(initialId)

        expect(storedMf?.id).toBe(initialId)
        expect(storedMf?.path).toBe(initialPath)
        expect(storedMf?.scanId).toBe(initialScan)
    })
})
