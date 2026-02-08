import fs from "fs/promises"
import os from "os"
import path from "path"
import { NodeFileSystem } from "@/infrastructure/file-system/NodeFileSystem.js"

const TEST_DIR = path.join(os.tmpdir(), "media-manager", "__testing__")

function testPath(relPath: string): string {
    return path.join(TEST_DIR, relPath)
}

async function createTestDir(dir: string): Promise<void> {
    await fs.mkdir(dir, { recursive: true })
}

async function createTestFile(filePath: string): Promise<void> {
    await createTestDir(path.dirname(filePath))
    await fs.writeFile(filePath, "Test file contents")
}

describe("tests NodeFileSystem implementation", () => {
    let fileSystem: NodeFileSystem
    beforeEach(async () => {
        fileSystem = new NodeFileSystem()
    })

    afterEach(async () => {
        await fs.rm(TEST_DIR, { recursive: true, force: true })
    })

    it("tests walkFiles method recursive default is true", async () => {
        const filePath1 = testPath("path/to/file1.csv")
        const filePath2 = testPath("path/to/file2.csv")
        const filePath3 = testPath("path/to/another/file3.html")
        const filePath4 = testPath("path/file4.mp4")
        const dirPath1 = testPath("path/to/dir")
        await createTestFile(filePath1)
        await createTestFile(filePath2)
        await createTestFile(filePath3)
        await createTestFile(filePath4)
        await createTestDir(dirPath1)

        const paths = await Array.fromAsync(
            fileSystem.walkFiles(testPath("path/to"))
        )
        expect(paths).toContain(filePath1)
        expect(paths).toContain(filePath2)
        expect(paths).toContain(filePath3)
        expect(paths).not.toContain(filePath4)
        expect(paths).not.toContain(dirPath1)
    })
})
