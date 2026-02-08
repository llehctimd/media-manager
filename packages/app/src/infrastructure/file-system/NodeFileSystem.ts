import fs from "fs/promises"
import path from "path"
import type { FileSystem } from "@/infrastructure/file-system/FileSystem.js"

export class NodeFileSystem implements FileSystem {
    constructor() {}
    async *walkFiles(directory: string) {
        const dir = await fs.opendir(directory, { recursive: true })
        for await (const dirent of dir) {
            if (dirent.isFile()) {
                yield path.join(dirent.parentPath, dirent.name)
            }
        }
    }
}
