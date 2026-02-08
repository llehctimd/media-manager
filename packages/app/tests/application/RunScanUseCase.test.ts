import { RunScanUseCase } from "@/application/RunScanUseCase.js"
import type { MediaFile } from "@/domain/media-files/MediaFile.js"
import type { MediaFileRepository } from "@/domain/media-files/MediaFileRepository.js"
import { Scan } from "@/domain/scans/Scan.js"
import type { ScanRepository } from "@/domain/scans/ScanRepository.js"
import type { FileSystem } from "@/infrastructure/file-system/FileSystem.js"

import type { Mock } from "vitest"

describe("Test RunScanUseCase service", () => {
    let mockFileSystem: FileSystem
    let mockScanRepository: ScanRepository
    let mockMediaFileRepository: MediaFileRepository
    let runScanUseCase: RunScanUseCase

    beforeEach(async () => {
        mockFileSystem = {
            walkFiles: vi.fn(async function* () {
                yield "path/to/file1.mp4"
                yield "path/to/file2.mp4"
            }),
        }
        mockScanRepository = {
            findById: vi.fn(
                async (id: string) =>
                    new Scan(id, "path/to/dir", "queued", null, null)
            ),
            save: vi.fn().mockResolvedValue(undefined),
        }
        mockMediaFileRepository = {
            findById: vi.fn().mockResolvedValue(null),
            findByPath: vi.fn().mockResolvedValue(null),
            save: vi.fn().mockResolvedValue(undefined),
            deleteNotScanId: vi.fn().mockResolvedValue(undefined),
        }
        runScanUseCase = new RunScanUseCase(
            mockFileSystem,
            mockScanRepository,
            mockMediaFileRepository
        )
    })

    afterEach(async () => {
        vi.useRealTimers()
    })

    it("should return a new queued scan immediately", async () => {
        const scan = await runScanUseCase.execute("path/to/dir")
        expect(scan.status).toBe("queued")
    })

    it("should have completed the scan and saved media files", async () => {
        const scanRepoScanCallArguments: Scan[] = []
        ;(mockScanRepository.save as Mock) = vi.fn((scan: Scan) =>
            scanRepoScanCallArguments.push(scan.clone())
        )
        vi.useFakeTimers()
        const scan = await runScanUseCase.execute("path/to/dir")
        await vi.runAllTimersAsync()

        expect(mockScanRepository.save).toHaveBeenCalledWith(scan)

        expect(mockMediaFileRepository.save).toHaveBeenCalledTimes(2)
        expect(
            (mockMediaFileRepository.save as Mock).mock.calls.map(
                (c) => c[0].path
            )
        ).toEqual(["path/to/file1.mp4", "path/to/file2.mp4"])

        expect(mockMediaFileRepository.deleteNotScanId).toHaveBeenCalledWith(
            scan.id
        )

        expect(scanRepoScanCallArguments.map((scan) => scan.status)).toEqual([
            "queued",
            "running",
            "completed",
        ])
    })

    it("should not allow a new scan to be created if one is already in progress", async () => {
        await runScanUseCase.execute("path/to/dir")
        await expect(runScanUseCase.execute("/path/to/dir2")).rejects.toThrow(
            "A scan is already in progress"
        )
    })
})
