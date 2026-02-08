import type { MediaFile } from "@/domain/media-files/MediaFile.js"
import type { MediaFileRepository } from "@/domain/media-files/MediaFileRepository.js"

export class MediaFileUseCase {
    private _mediaFileRepo: MediaFileRepository

    constructor(mediaFileRepository: MediaFileRepository) {
        this._mediaFileRepo = mediaFileRepository
    }

    async get(id: string): Promise<MediaFile | null> {
        return await this._mediaFileRepo.findById(id)
    }

    async getAll(): Promise<MediaFile[]> {
        return await this._mediaFileRepo.findAll()
    }
}
