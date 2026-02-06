import fs from "fs/promises"
import path from "path"

export interface IFileSystem {
    walkFiles(directory: string): AsyncIterable<string>;
}

export class NodeFileSystem implements IFileSystem {
    constructor() {}

    async *walkFiles(directory: string) {
        const dir = await fs.opendir(directory, { recursive: true  })
        for await (const dirent of dir) {
            if (dirent.isFile()) {
                yield path.join(dirent.parentPath, dirent.name)
            }
        }
    }
}