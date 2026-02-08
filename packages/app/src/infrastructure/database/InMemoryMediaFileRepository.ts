import { MediaFile } from "@/domain/media-files/MediaFile.js"
import type { MediaFileRepository } from "@/domain/media-files/MediaFileRepository.js"

type MediaFileData = {
    path: string
    scanId: string
}

export class InMemoryMediaFileRepository implements MediaFileRepository {
    private _idToDataMap: Map<string, MediaFileData>
    private _pathToIdMap: Map<string, string>

    constructor() {
        this._idToDataMap = new Map()
        this._pathToIdMap = new Map()
    }

    async findById(id: string): Promise<MediaFile | null> {
        const data = this._idToDataMap.get(id)
        if (data === undefined) {
            return null
        }
        return new MediaFile(id, data.path, data.scanId)
    }

    async findByPath(path: string): Promise<MediaFile | null> {
        const id = this._pathToIdMap.get(path)
        if (id === undefined) {
            return null
        }
        const data = this._idToDataMap.get(id)
        if (data === undefined) {
            throw new Error("Data should have existed")
        }
        return new MediaFile(id, data.path, data.scanId)
    }

    async findAll(): Promise<MediaFile[]> {
        return Array.from(
            this._idToDataMap.entries().map((entry) => {
                return new MediaFile(entry[0], entry[1].path, entry[1].scanId)
            })
        )
    }

    async save(mediaFile: MediaFile): Promise<void> {
        const existingMf = await this.findById(mediaFile.id)
        if (existingMf === null) {
            // new media file
            const existingPathId = this._pathToIdMap.get(mediaFile.path)
            if (existingPathId !== undefined) {
                throw new Error(
                    "MediaFileRepository has unique condition on path"
                )
            }
            this._idToDataMap.set(mediaFile.id, {
                path: mediaFile.path,
                scanId: mediaFile.scanId,
            })
            this._pathToIdMap.set(mediaFile.path, mediaFile.id)
            return
        }
        // update media file
        if (mediaFile.path === existingMf.path) {
            // no need to update pathToIdMap
            this._idToDataMap.set(mediaFile.id, {
                path: mediaFile.path,
                scanId: mediaFile.scanId,
            })
            return
        }
        const existingPathId = this._pathToIdMap.get(mediaFile.path)
        if (existingPathId !== null) {
            throw new Error("MediaFileRepository has unique condition on path")
        }
        this._idToDataMap.set(mediaFile.id, {
            path: mediaFile.path,
            scanId: mediaFile.scanId,
        })
        this._pathToIdMap.set(mediaFile.path, mediaFile.id)
    }

    async deleteNotScanId(scanId: string): Promise<number> {
        const newIdToDataMap: Map<string, MediaFileData> = new Map()
        const newPathToIdMap: Map<string, string> = new Map()
        let count = 0
        for (const [id, data] of this._idToDataMap.entries()) {
            if (data.scanId === scanId) {
                newIdToDataMap.set(id, data)
                newPathToIdMap.set(data.path, id)
            } else {
                count += 1
            }
        }
        this._idToDataMap = newIdToDataMap
        this._pathToIdMap = newPathToIdMap
        return count
    }
}
