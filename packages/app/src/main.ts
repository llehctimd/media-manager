import express from "express"
import { ScanController } from "./controllers/ScanController.js"
import { ScanUseCase } from "./application/ScanUseCase.js"
import { NodeFileSystem } from "./infrastructure/file-system/NodeFileSystem.js"
import { InMemoryScanRepository } from "./infrastructure/database/InMemoryScanRepository.js"
import { InMemoryMediaFileRepository } from "./infrastructure/database/InMemoryMediaFileRepository.js"
import { ConsoleLogger } from "./infrastructure/logging/ConsoleLogger.js"

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
    const scanController = new ScanController(scanUseCase)

    // Express set up
    const app = express()
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))

    const apiRouter = express.Router()
    const apiScanRouter = express.Router()

    apiScanRouter.post("/", (req, res) => scanController.queueScan(req, res))
    apiScanRouter.get("/:id", (req, res) => scanController.getScan(req, res))

    apiRouter.use("/scans", apiScanRouter)

    app.use("/api/v1", apiRouter)

    app.get("/", async (_, res) => {
        return res.send("Hello, world!")
    })

    app.listen(PORT, () => {
        console.log(`Listening on port ${PORT}`)
    })
}

main()
