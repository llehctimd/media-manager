import { MediaFile } from "@/domain/media-files/MediaFile.js"
import type { MediaFileRepository } from "@/domain/media-files/MediaFileRepository.js"
import { Scan } from "@/domain/scans/Scan.js"
import type { ScanRepository } from "@/domain/scans/ScanRepository.js"
import type { FileSystem } from "@/infrastructure/file-system/FileSystem.js"

export class RunScanUseCase {
    private _fs: FileSystem
    private _scanRepo: ScanRepository
    private _mediaFileRepo: MediaFileRepository
    private _currentScanId: string | null

    constructor(
        fileSystem: FileSystem,
        scanRepository: ScanRepository,
        mediaFileRespository: MediaFileRepository
    ) {
        this._fs = fileSystem
        this._scanRepo = scanRepository
        this._mediaFileRepo = mediaFileRespository
        this._currentScanId = null
    }

    async execute(path: string): Promise<Scan> {
        if (this._currentScanId !== null) {
            throw new Error("A scan is already in progress")
        }
        const scan = Scan.create(path)
        this._currentScanId = scan.id
        await this._scanRepo.save(scan)
        void (async () => {
            const thisScan = scan.clone()
            const startedAt = new Date()
            thisScan.run(startedAt)
            await this._scanRepo.save(thisScan)

            for await (const path of this._fs.walkFiles(thisScan.path)) {
                let mediaFile = await this._mediaFileRepo.findByPath(path)
                if (mediaFile === null) {
                    mediaFile = MediaFile.create(path, thisScan.id)
                } else {
                    mediaFile.scanId = thisScan.id
                }
                await this._mediaFileRepo.save(mediaFile)
            }
            await this._mediaFileRepo.deleteNotScanId(thisScan.id)

            const finishedAt = new Date()
            thisScan.complete(finishedAt)
            await this._scanRepo.save(thisScan)
            this._currentScanId = null
        })()
        return scan
    }
}
