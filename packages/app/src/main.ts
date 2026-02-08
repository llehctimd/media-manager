import express from "express"

const PORT = 6969

const app = express()

app.get("/", async (_, res) => {
    return res.send("Hello, world!")
})

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})
