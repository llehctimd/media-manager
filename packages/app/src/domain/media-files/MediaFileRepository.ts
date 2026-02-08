import type { MediaFile } from "@/domain/media-files/MediaFile.js"

export interface MediaFileRepository {
    findById(id: string): Promise<MediaFile | null>
    findByPath(path: string): Promise<MediaFile | null>
    save(mediaFile: MediaFile): Promise<void>
    deleteNotScanId(scanId: string): Promise<number>
}
