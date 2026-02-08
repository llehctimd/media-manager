import express from "express"
import { ScanController } from "./controllers/ScanController.js"
import { ScanUseCase } from "./application/ScanUseCase.js"
import { NodeFileSystem } from "./infrastructure/file-system/NodeFileSystem.js"
import { InMemoryScanRepository } from "./infrastructure/database/InMemoryScanRepository.js"
import { InMemoryMediaFileRepository } from "./infrastructure/database/InMemoryMediaFileRepository.js"
import { ConsoleLogger } from "./infrastructure/logging/ConsoleLogger.js"
import { MediaFileController } from "./controllers/MediaFileController.js"
import { MediaFileUseCase } from "./application/MediaFileUseCase.js"

const PORT = 6969

async function main() {
    // Application set up
    const consoleLogger = new ConsoleLogger()
    const fileSystem = new NodeFileSystem()
    const scanRepository = new InMemoryScanRepository()
    const mediaFileRespository = new InMemoryMediaFileRepository()
    const scanUseCase = new ScanUseCase(
        fileSystem,
        scanRepository,
        mediaFileRespository,
        consoleLogger
    )
    const mediaFileUseCase = new MediaFileUseCase(mediaFileRespository)
    const scanController = new ScanController(scanUseCase)
    const mediaFileController = new MediaFileController(mediaFileUseCase)

    // Express set up
    const app = express()
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))

    const apiRouter = express.Router()
    const apiScanRouter = express.Router()
    const apiMediaFilesRouter = express.Router()

    apiScanRouter.post("/", (req, res) => scanController.queueScan(req, res))
    apiScanRouter.get("/:id", (req, res) => scanController.getScan(req, res))
    apiRouter.use("/scans", apiScanRouter)

    apiMediaFilesRouter.get("/", (req, res) => mediaFileController.getAll(req, res))
    apiMediaFilesRouter.get("/:id", (req, res) => mediaFileController.get(req, res))
    apiRouter.use("/media-files")

    app.use("/api/v1", apiRouter)

    app.get("/", async (_, res) => {
        return res.send("Hello, world!")
    })

    app.listen(PORT, () => {
        console.log(`Listening on port ${PORT}`)
    })
}

main()
