import { MediaFileController } from "@/controllers/MediaFileController.js"
import { MediaFile } from "@/domain/media-files/MediaFile.js"
import { createMockRequest, createMockResponse } from "tests/mocks/MockExpress.js"
import { createMockMediaFileUseCase, type MockMediaFileUseCase } from "tests/mocks/MockMediaFileUseCase.js"

describe("test MediaFileController", () => {
    let mediaFileController: MediaFileController
    let mockMediaFileUseCase: MockMediaFileUseCase

    beforeEach(async () => {
        mockMediaFileUseCase = createMockMediaFileUseCase()
        mediaFileController = new MediaFileController(mockMediaFileUseCase)
    })

    afterEach(async () => {})

    it("tests get should return media file json", async () => {
        const mediaFile = new MediaFile("test-id", "path/to/file", "scan-1")
        const req = createMockRequest()
        req.params = {
            id: "test-id"
        }
        const res = createMockResponse()

        mockMediaFileUseCase.get.mockImplementation(() => mediaFile)
        const mediaFileJSON = mediaFile.toJSON()
        await mediaFileController.get(req, res)

        expect(mockMediaFileUseCase.get).toHaveBeenCalledExactlyOnceWith(mediaFile.id)
        expect(res.status).toHaveBeenCalledExactlyOnceWith(200)
        expect(res.json).toHaveBeenCalledExactlyOnceWith(mediaFileJSON)
    })


    it("tests getAll should return media files json", async () => {
        const mediaFile1 = new MediaFile("test-id", "path/to/file", "scan-1")
        const mediaFile2 = new MediaFile("test-id", "path/to/file", "scan-1")
        const req = createMockRequest()
        const res = createMockResponse()

        mockMediaFileUseCase.getAll.mockImplementation(() => [mediaFile1, mediaFile2])
        const mediaFilesJSON = [
            mediaFile1.toJSON(),
            mediaFile2.toJSON()
        ]
        await mediaFileController.getAll(req, res)

        expect(mockMediaFileUseCase.getAll).toHaveBeenCalledOnce()
        expect(res.status).toHaveBeenCalledExactlyOnceWith(200)
        expect(res.json).toHaveBeenCalledExactlyOnceWith(mediaFilesJSON)
    })
})
