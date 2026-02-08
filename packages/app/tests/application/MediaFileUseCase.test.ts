import { MediaFileUseCase } from "@/application/MediaFileUseCase.js"
import { MediaFile } from "@/domain/media-files/MediaFile.js"
import {
    type MockMediaFileRepository,
    createMockMediaFileRepository,
} from "tests/mocks/MockMediaFileRepository.js"

describe("test MediaFileUseCase", () => {
    let mediaFileUseCase: MediaFileUseCase
    let mockMediaFileRepository: MockMediaFileRepository
    beforeEach(async () => {
        mockMediaFileRepository = createMockMediaFileRepository()
        mediaFileUseCase = new MediaFileUseCase(mockMediaFileRepository)
    })

    afterEach(async () => {})

    it("should get and return a mediafile that exists in the repository", async () => {
        const expectedMediaFile = new MediaFile(
            "test-id",
            "path/to/file.mp4",
            "test-scan-id"
        )
        mockMediaFileRepository.findById.mockImplementation(
            async () => expectedMediaFile
        )
        const mf = await mediaFileUseCase.get("test-id")
        expect(mf).not.toBeNull()
        expect(
            mockMediaFileRepository.findById
        ).toHaveBeenCalledExactlyOnceWith("test-id")
    })

    it("should get and return null for a media file that does not exists in the repository", async () => {
        mockMediaFileRepository.findById.mockImplementation(async () => null)
        const mf = await mediaFileUseCase.get("test-id")
        expect(mf).toBeNull()
        expect(
            mockMediaFileRepository.findById
        ).toHaveBeenCalledExactlyOnceWith("test-id")
    })

    it("should get all and return an array of media files", async () => {
        mockMediaFileRepository.findAll.mockImplementation(async () => [
            new MediaFile("test-id-1", "path/to/file1.mp4", "test-scan-id"),
            new MediaFile("test-id-2", "path/to/file2.mp4", "test-scan-id"),
        ])
        const mfs = await mediaFileUseCase.getAll()
        expect(mfs).toHaveLength(2)
        expect(mockMediaFileRepository.findAll).toHaveBeenCalledOnce()
    })

    it("should get all and return an empty array of media files if none found", async () => {
        mockMediaFileRepository.findAll.mockImplementation(async () => [])
        const mfs = await mediaFileUseCase.getAll()
        expect(mfs).toHaveLength(0)
        expect(mockMediaFileRepository.findAll).toHaveBeenCalledOnce()
    })
})
