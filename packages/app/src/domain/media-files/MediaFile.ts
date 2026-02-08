import { v7 as uuidv7 } from "uuid"

export class MediaFile {
    constructor(
        public id: string,
        public path: string,
        public scanId: string
    ) {}

    static create(path: string, scanId: string) {
        return new MediaFile(uuidv7(), path, scanId)
    }
}
