import { SeasonService } from "@/application/SeasonService.js"
import { Season, SeasonNumber } from "@/domain/model/Season.js"
import { NotFoundError } from "@/errors.js"
import {
    createMockSeasonRepository,
    type MockSeasonRepository,
} from "tests/mocks/MockSeasonRepository.js"

let mockSeasonRepository: MockSeasonRepository
let seasonService: SeasonService

beforeEach(async () => {
    mockSeasonRepository = createMockSeasonRepository()
    seasonService = new SeasonService(mockSeasonRepository)
})

afterEach(async () => {})

describe("tests SeasonService createSeason", () => {
    it("should create a new Season, save to repo and return DTO", async () => {
        const seasonDTO = await seasonService.createSeason({
            showId: "show-id",
            seasonNumber: 1,
        })
        const expectedDTO = {
            id: seasonDTO.id,
            showId: "show-id",
            seasonNumber: 1,
        }
        expect(mockSeasonRepository.save).toHaveBeenCalledOnce()
        expect(seasonDTO).toEqual(expectedDTO)
    })
})

describe("tests SeasonService getSeasonById", () => {
    it("should return the SeasonDTO corresponding to the Season found in repo", async () => {
        const findId = "test-season-id"
        mockSeasonRepository.find.mockImplementation(
            (id: string) => new Season(id, "show-id", new SeasonNumber(1))
        )
        const expectedDTO = {
            id: findId,
            showId: "show-id",
            seasonNumber: 1,
        }

        const resultDTO = await seasonService.getSeasonById({ id: findId })
        expect(resultDTO).toEqual(expectedDTO)
        expect(mockSeasonRepository.find).toHaveBeenCalledExactlyOnceWith(
            findId
        )
    })

    it("should throw NotFoundError if repo find method does", async () => {
        const nonexistentId = "nonexistent-id"
        const expectedError = new NotFoundError(
            "Season not found",
            "SEASON_NOT_FOUND_ERROR",
            {
                id: nonexistentId,
            }
        )
        mockSeasonRepository.find.mockImplementation((id: string) => {
            throw new NotFoundError(
                "Season not found",
                "SEASON_NOT_FOUND_ERROR",
                {
                    id,
                }
            )
        })

        await expect(
            seasonService.getSeasonById({ id: nonexistentId })
        ).rejects.toThrow(expectedError)
    })
})

describe("tests SeasonService getAllSeasons", () => {
    it("should return seasons found by repo findAll method", async () => {
        const seasons = [
            Season.create("show-id", new SeasonNumber(1)),
            Season.create("show-id", new SeasonNumber(2)),
        ]
        mockSeasonRepository.findAll.mockImplementation(() => seasons)

        const expectedDTOArray = [
            {
                id: seasons[0]?.id,
                showId: seasons[0]?.showId,
                seasonNumber: seasons[0]?.seasonNumber.number,
            },
            {
                id: seasons[1]?.id,
                showId: seasons[1]?.showId,
                seasonNumber: seasons[1]?.seasonNumber.number,
            },
        ]

        const seasonDTOArray = await seasonService.getAllSeasons()
        expect(mockSeasonRepository.findAll).toHaveBeenCalledOnce()
        expect(seasonDTOArray).toEqual(expectedDTOArray)
    })

    it("should return an empty array if no seasons in repo", async () => {
        mockSeasonRepository.findAll.mockImplementation(() => [])

        const emptyDTOArray = await seasonService.getAllSeasons()
        expect(mockSeasonRepository.findAll).toHaveBeenCalledOnce()
        expect(emptyDTOArray).toEqual([])
    })
})

describe("tests SeasonService updateSeason", () => {
    it("should call repo find, modify the showId and seasonNumber on season entity and call save on it", async () => {
        const intialSeason = Season.create("show-id-1", new SeasonNumber(1))
        const updatedSeason = new Season(
            intialSeason.id,
            "show-id-2",
            new SeasonNumber(2)
        )

        mockSeasonRepository.find.mockImplementation(() => intialSeason)

        await seasonService.updateSeason({
            id: intialSeason.id,
            showId: "show-id-2",
            seasonNumber: 2,
        })

        expect(mockSeasonRepository.find).toHaveBeenCalledExactlyOnceWith(
            intialSeason.id
        )
        expect(mockSeasonRepository.save).toHaveBeenCalledExactlyOnceWith(
            updatedSeason
        )
    })

    it("should call repo find, modify only the showId on season entity and call save on it", async () => {
        const intialSeason = Season.create("show-id-1", new SeasonNumber(1))
        const updatedSeason = new Season(
            intialSeason.id,
            "show-id-2",
            new SeasonNumber(1)
        )

        mockSeasonRepository.find.mockImplementation(() => intialSeason)

        await seasonService.updateSeason({
            id: intialSeason.id,
            showId: "show-id-2",
        })

        expect(mockSeasonRepository.find).toHaveBeenCalledExactlyOnceWith(
            intialSeason.id
        )
        expect(mockSeasonRepository.save).toHaveBeenCalledExactlyOnceWith(
            updatedSeason
        )
    })

    it("should call repo find, modify only the seasonNumber on season entity and call save on it", async () => {
        const intialSeason = Season.create("show-id-1", new SeasonNumber(1))
        const updatedSeason = new Season(
            intialSeason.id,
            "show-id-1",
            new SeasonNumber(2)
        )

        mockSeasonRepository.find.mockImplementation(() => intialSeason)

        await seasonService.updateSeason({
            id: intialSeason.id,
            seasonNumber: 2,
        })

        expect(mockSeasonRepository.find).toHaveBeenCalledExactlyOnceWith(
            intialSeason.id
        )
        expect(mockSeasonRepository.save).toHaveBeenCalledExactlyOnceWith(
            updatedSeason
        )
    })
})

describe("tests SeasonService deleteSeason", () => {
    it("should call repo delete on id", async () => {
        const deleteId = "test-id"
        await seasonService.deleteSeason({ id: deleteId })
        expect(mockSeasonRepository.delete).toHaveBeenCalledExactlyOnceWith(
            deleteId
        )
    })

    it("should throw NotFoundError if no seasons are deleted", async () => {
        const deleteId = "test-id"
        const expectedError = new NotFoundError(
            "Season not found",
            "SEASON_NOT_FOUND_ERROR",
            { id: deleteId }
        )
        mockSeasonRepository.delete.mockImplementation((id: string) => {
            throw new NotFoundError(
                "Season not found",
                "SEASON_NOT_FOUND_ERROR",
                {
                    id,
                }
            )
        })
        await expect(seasonService.deleteSeason({ id: deleteId })).rejects.toThrow(expectedError)
        expect(mockSeasonRepository.delete).toHaveBeenCalledExactlyOnceWith(
            deleteId
        )
    })
})
