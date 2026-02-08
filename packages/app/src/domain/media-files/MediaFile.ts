import { v7 as uuidv7 } from "uuid"

interface MediaFileDTO {
    id: string,
    path: string,
    scanId: string
}

export class MediaFile {
    constructor(
        public id: string,
        public path: string,
        public scanId: string
    ) {}

    static create(path: string, scanId: string) {
        return new MediaFile(uuidv7(), path, scanId)
    }

    clone(): MediaFile {
        return new MediaFile(
            this.id,
            this.path,
            this.scanId,
        )
    }

    toJSON(): MediaFileDTO {
        return {
            id: this.id,
            path: this.path,
            scanId: this.scanId
        }
    }
}
