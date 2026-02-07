import {
    type IMediaFileRepository,
    MapMediaFileRepository,
} from "./media-file-repository.js"
import { createMediaFile } from "../model/media-file.js"

describe("MapMediaFileRepository implementation", () => {
    let mfRepo: IMediaFileRepository
    beforeEach(() => {
        mfRepo = new MapMediaFileRepository() as IMediaFileRepository
    })

    afterEach(() => {})

    it("tests insert and get", async () => {
        const mf = createMediaFile("path/to/test-file.mp4")
        await mfRepo.insert(mf)
        const sameMf = await mfRepo.get(mf.id)
        expect(mf).toEqual(sameMf)
    })

    it("tests get on non-existent id throws", async () => {
        await expect(mfRepo.get("non-existent")).rejects.toThrow(
            new Error(
                `No media file with id 'non-existent' exists in repository`
            )
        )
    })

    it("tests getAll returns all inserted media files", async () => {
        const mf1 = createMediaFile("path/to/file1.mp4")
        const mf2 = createMediaFile("path/to/file2.avi")
        const mf3 = createMediaFile("path/to/another/file3.mp3")
        const mf4 = createMediaFile("path/not-inserted.sub")

        await mfRepo.insert(mf1)
        await mfRepo.insert(mf2)
        await mfRepo.insert(mf3)

        const mfs = await mfRepo.getAll()
        expect(mfs).toContainEqual(mf1)
        expect(mfs).toContainEqual(mf2)
        expect(mfs).toContainEqual(mf3)
        expect(mfs).not.toContainEqual(mf4)
    })

    it("tests getAll returns empty array with no files", async () => {
        const mfs = await mfRepo.getAll()
        expect(mfs).toHaveLength(0)
    })

    it("tests update media file", async () => {
        const mf = createMediaFile("path/to/file.ext")
        await mfRepo.insert(mf)
        mf.path = "path/to/other.ext"
        await mfRepo.update(mf)
        const updatedMf = await mfRepo.get(mf.id)
        expect(mf).toEqual(updatedMf)
    })

    it("tests update on non-existent id throws", async () => {
        const mf = createMediaFile("path/to/file.7z")
        await expect(mfRepo.update(mf)).rejects.toThrow(
            new Error(`No media file with id '${mf.id}' exists in repository`)
        )
    })

    it("tests insert on already existing id throws", async () => {
        const mf = createMediaFile("path/to/file.csv")
        await expect(mfRepo.insert(mf)).resolves.not.toThrow()
        await expect(mfRepo.insert(mf)).rejects.toThrow(
            new Error(
                `Media file with id '${mf.id}' already exists in repository`
            )
        )
    })

    it("tests delete on inserted media file", async () => {
        const mf = createMediaFile("path/to/file.jpeg")
        await mfRepo.insert(mf)
        await mfRepo.delete(mf.id)
        await expect(mfRepo.get(mf.id)).rejects.toThrow()
        await expect(mfRepo.getAll()).resolves.toHaveLength(0)
    })

    it("tests delete on non-existent id throws", async () => {
        const mf = createMediaFile("path/to/file.css")
        await expect(mfRepo.delete(mf.id)).rejects.toThrow(
            new Error(`No media file with id '${mf.id}' exists in repository`)
        )
    })
})
