import { EpisodeService } from "@/application/EpisodeService.js"
import { Episode, EpisodeNumber } from "@/domain/model/Episode.js"
import { DomainError, NotFoundError } from "@/errors.js"
import {
    createMockEpisodeRepository,
    type MockEpisodeRepository,
} from "tests/mocks/MockEpisodeRepository.js"

let mockEpisodeRepository: MockEpisodeRepository
let episodeService: EpisodeService

beforeEach(async () => {
    mockEpisodeRepository = createMockEpisodeRepository()
    episodeService = new EpisodeService(mockEpisodeRepository)
})

afterEach(async () => {})

describe("tests EpisodeService createEpisode", () => {
    it("should create a new Episode, save to repo and return DTO", async () => {
        const episodeDTO = await episodeService.createEpisode({
            showId: "show-id",
            seasonId: "season-id",
            episodeNumber: 1,
        })
        const expectedDTO = {
            id: episodeDTO.id,
            showId: "show-id",
            seasonId: "season-id",
            episodeNumber: 1,
        }
        expect(mockEpisodeRepository.save).toHaveBeenCalledOnce()
        expect(episodeDTO).toEqual(expectedDTO)
    })
})

describe("tests EpisodeService getEpisodeById", () => {
    it("should return the EpisodeDTO corresponding to the Episode found in repo", async () => {
        const findId = "test-episode-id"
        mockEpisodeRepository.find.mockImplementation(
            (id: string) =>
                new Episode(id, "show-id", "season-id", new EpisodeNumber(1))
        )
        const expectedDTO = {
            id: findId,
            showId: "show-id",
            seasonId: "season-id",
            episodeNumber: 1,
        }

        const resultDTO = await episodeService.getEpisodeById({ id: findId })
        expect(resultDTO).toEqual(expectedDTO)
        expect(mockEpisodeRepository.find).toHaveBeenCalledExactlyOnceWith(
            findId
        )
    })

    it("should throw NotFoundError if repo find method does", async () => {
        const nonexistentId = "nonexistent-id"
        const expectedError = new NotFoundError(
            "Episode not found",
            "EPISODE_NOT_FOUND_ERROR",
            {
                id: nonexistentId,
            }
        )
        mockEpisodeRepository.find.mockImplementation((id: string) => {
            throw new NotFoundError(
                "Episode not found",
                "EPISODE_NOT_FOUND_ERROR",
                {
                    id,
                }
            )
        })

        await expect(
            episodeService.getEpisodeById({ id: nonexistentId })
        ).rejects.toThrow(expectedError)
    })
})

describe("tests EpisodeService getAllEpisodes", () => {
    it("should return episodes found by repo findAll method", async () => {
        const episodes = [
            Episode.create("show-id", "season-id", new EpisodeNumber(1)),
            Episode.create("show-id", "season-id", new EpisodeNumber(2)),
        ]
        mockEpisodeRepository.findAll.mockImplementation(() => episodes)

        const expectedDTOArray = [
            {
                id: episodes[0]?.id,
                showId: episodes[0]?.showId,
                seasonId: episodes[0]?.seasonId,
                episodeNumber: episodes[0]?.episodeNumber.number,
            },
            {
                id: episodes[1]?.id,
                showId: episodes[1]?.showId,
                seasonId: episodes[1]?.seasonId,
                episodeNumber: episodes[1]?.episodeNumber.number,
            },
        ]

        const episodeDTOArray = await episodeService.getAllEpisodes()
        expect(mockEpisodeRepository.findAll).toHaveBeenCalledOnce()
        expect(episodeDTOArray).toEqual(expectedDTOArray)
    })

    it("should return an empty array if no episodes in repo", async () => {
        mockEpisodeRepository.findAll.mockImplementation(() => [])

        const emptyDTOArray = await episodeService.getAllEpisodes()
        expect(mockEpisodeRepository.findAll).toHaveBeenCalledOnce()
        expect(emptyDTOArray).toEqual([])
    })
})

describe("tests EpisodeService updateEpisode", () => {
    it("should call repo find, modify properties on episode entity and call save on it", async () => {
        const initialEpisode = Episode.create(
            "show-id-1",
            "season-id-1",
            new EpisodeNumber(1)
        )
        const updatedEpisode = new Episode(
            initialEpisode.id,
            "show-id-2",
            "season-id-2",
            new EpisodeNumber(2)
        )

        mockEpisodeRepository.find.mockImplementation(() => initialEpisode)

        await episodeService.updateEpisode({
            id: initialEpisode.id,
            showId: "show-id-2",
            seasonId: "season-id-2",
            episodeNumber: 2,
        })

        expect(mockEpisodeRepository.find).toHaveBeenCalledExactlyOnceWith(
            initialEpisode.id
        )
        expect(mockEpisodeRepository.save).toHaveBeenCalledExactlyOnceWith(
            updatedEpisode
        )
    })

    it("should call repo find, modify only showId & seasonId on episode entity and call save on it", async () => {
        const initialEpisode = Episode.create(
            "show-id-1",
            "season-id-1",
            new EpisodeNumber(1)
        )
        const updatedEpisode = new Episode(
            initialEpisode.id,
            "show-id-2",
            "season-id-2",
            new EpisodeNumber(1)
        )

        mockEpisodeRepository.find.mockImplementation(() => initialEpisode)

        await episodeService.updateEpisode({
            id: initialEpisode.id,
            showId: "show-id-2",
            seasonId: "season-id-2",
        })

        expect(mockEpisodeRepository.find).toHaveBeenCalledExactlyOnceWith(
            initialEpisode.id
        )
        expect(mockEpisodeRepository.save).toHaveBeenCalledExactlyOnceWith(
            updatedEpisode
        )
    })

    it("should call repo find, modify only episode number on episode entity and call save on it", async () => {
        const initialEpisode = Episode.create(
            "show-id-1",
            "season-id-1",
            new EpisodeNumber(1)
        )
        const updatedEpisode = new Episode(
            initialEpisode.id,
            "show-id-1",
            "season-id-1",
            new EpisodeNumber(2)
        )

        mockEpisodeRepository.find.mockImplementation(() => initialEpisode)

        await episodeService.updateEpisode({
            id: initialEpisode.id,
            episodeNumber: 2,
        })

        expect(mockEpisodeRepository.find).toHaveBeenCalledExactlyOnceWith(
            initialEpisode.id
        )
        expect(mockEpisodeRepository.save).toHaveBeenCalledExactlyOnceWith(
            updatedEpisode
        )
    })
})

describe("tests EpisodeService deleteEpisode", () => {
    it("should call repo delete on id", async () => {
        const deleteId = "test-id"
        await episodeService.deleteEpisode({ id: deleteId })
        expect(mockEpisodeRepository.delete).toHaveBeenCalledExactlyOnceWith(
            deleteId
        )
    })

    it("should throw NotFoundError if no episodes are delete", async () => {
        const deleteId = "test-id"
        const expectedError = new NotFoundError(
            "Episode not found",
            "EPISODE_NOT_FOUND_ERROR",
            { id: deleteId }
        )
        mockEpisodeRepository.delete.mockImplementation((id: string) => {
            throw new NotFoundError(
                "Episode not found",
                "EPISODE_NOT_FOUND_ERROR",
                {
                    id,
                }
            )
        })
        await expect(
            episodeService.deleteEpisode({ id: deleteId })
        ).rejects.toThrow(expectedError)
        expect(mockEpisodeRepository.delete).toHaveBeenCalledExactlyOnceWith(
            deleteId
        )
    })
})
