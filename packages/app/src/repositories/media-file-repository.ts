import type { MediaFile } from "../model/media-file.js"

export interface IMediaFileRepository {
    get(id: string): Promise<MediaFile> 
    getAll(): Promise<MediaFile[]>
    update(mediaFile: MediaFile): Promise<void>
    insert(mediaFile: MediaFile): Promise<void>
    delete(id: string): Promise<void>
}

export class MapMediaFileRepository implements IMediaFileRepository {
    private _mfMap: Map<string, MediaFile>

    constructor() {
        this._mfMap = new Map()
    }

    async get(id: string): Promise<MediaFile> {
        const mf = this._mfMap.get(id)
        if (mf == null) {
            throw new Error(`No media file with id '${id}' exists in repository`)
        }
        return mf
    }

    async getAll(): Promise<MediaFile[]> {
        return Array.from(this._mfMap.values())
    }

    async update(mediaFile: MediaFile): Promise<void> {
        if (!this._mfMap.has(mediaFile.id)) {
            throw new Error(`No media file with id '${mediaFile.id}' exists in repository`)
        }
        this._mfMap.set(mediaFile.id, mediaFile)
    }

    async insert(mediaFile: MediaFile): Promise<void> {
        if (this._mfMap.has(mediaFile.id)) {
            throw new Error(`Media file with id '${mediaFile.id}' already exists in repository`)
        }
        this._mfMap.set(mediaFile.id, mediaFile)
    }

    async delete(id: string): Promise<void> {
        if (!this._mfMap.delete(id)) {
            throw new Error(`No media file with id '${id}' exists in repository`)
        }
    }
}