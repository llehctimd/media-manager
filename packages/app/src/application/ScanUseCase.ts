import { MediaFile } from "@/domain/media-files/MediaFile.js"
import type { MediaFileRepository } from "@/domain/media-files/MediaFileRepository.js"
import { Scan } from "@/domain/scans/Scan.js"
import type { ScanRepository } from "@/domain/scans/ScanRepository.js"
import type { FileSystem } from "@/infrastructure/file-system/FileSystem.js"
import type { Logger } from "@/infrastructure/logging/Logger.js"

export class ScanUseCase {
    private _fs: FileSystem
    private _scanRepo: ScanRepository
    private _mediaFileRepo: MediaFileRepository
    private _logger: Logger
    private _currentScanId: string | null

    constructor(
        fileSystem: FileSystem,
        scanRepository: ScanRepository,
        mediaFileRespository: MediaFileRepository,
        logger: Logger
    ) {
        this._fs = fileSystem
        this._scanRepo = scanRepository
        this._mediaFileRepo = mediaFileRespository
        this._logger = logger
        this._currentScanId = null
    }

    async queueScan(path: string): Promise<Scan> {
        if (this._currentScanId !== null) {
            this._logger.error("A scan is already in progress")
            throw new Error("A scan is already in progress")
        }
        const scan = Scan.create(path)
        this._currentScanId = scan.id
        await this._scanRepo.save(scan)
        void (async () => {
            const thisScan = scan.clone()
            this._logger.info(`Scan ${thisScan.id} started`)
            const startedAt = new Date()
            thisScan.toRun(startedAt)
            await this._scanRepo.save(thisScan)
            try {
                for await (const path of this._fs.walkFiles(thisScan.path)) {
                    let mediaFile = await this._mediaFileRepo.findByPath(path)
                    if (mediaFile === null) {
                        mediaFile = MediaFile.create(path, thisScan.id)
                    } else {
                        mediaFile.scanId = thisScan.id
                    }
                    await this._mediaFileRepo.save(mediaFile)
                }
            } catch (err) {
                const finishedAt = new Date()
                if (err instanceof Error) {
                    this._logger.error(err.message)
                    thisScan.toError(finishedAt, err.message)
                } else {
                    this._logger.error(`UNKNOWN ERROR SCANNING: ${scan.id}`)
                    thisScan.toError(finishedAt, "Unknown error scanning")
                }
                this._scanRepo.save(thisScan)
                this._logger.info(`Scan ${thisScan.id} errored`)
                this._currentScanId = null
                return
            }
            await this._mediaFileRepo.deleteNotScanId(thisScan.id)
            
            const finishedAt = new Date()
            thisScan.toComplete(finishedAt)
            await this._scanRepo.save(thisScan)
            this._currentScanId = null
            this._logger.info(`Scan ${thisScan.id} completed`)
        })()
        return scan
    }

    async getScan(id: string): Promise<Scan | null> {
        return await this._scanRepo.findById(id)
    }
}
