import express from "express"
import { InMemoryMediaFileRepository } from "./infrastructure/database/InMemoryMediaFileRepository.js"

const PORT = 6969

const app = express()

const repo = new InMemoryMediaFileRepository()

app.get("/", async (_, res) => {
    await repo.findById("Hello")
    return res.send("Hello, world!")
})

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})
