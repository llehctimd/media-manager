import { Season, SeasonNumber } from "@/domain/model/Season.js"
import { Show } from "@/domain/model/Show.js"
import type { SeasonRepository } from "@/domain/repository/SeasonRepository.js"
import type { ShowRepository } from "@/domain/repository/ShowRepository.js"
import { NotFoundError } from "@/errors.js"
import { SQLite3SeasonRepository } from "@/infrastructure/sqlite3/SQLite3SeasonRepository.js"
import { SQLite3ShowRepository } from "@/infrastructure/sqlite3/SQLite3ShowRepository.js"
import type { Database } from "better-sqlite3"
import { createTestSQLite3Database } from "tests/helpers/sqlite3-database.js"

// Unfortunately coupled with ShowRepository because of foreign key constraint

describe("tests SQLite3SeasonRepository persistence", () => {
    let testShow: Show
    let showRepo: ShowRepository
    let seasonRepo: SeasonRepository
    let db: Database
    beforeEach(async () => {
        db = createTestSQLite3Database()
        showRepo = new SQLite3ShowRepository(db)
        testShow = Show.create("Test Show", 2026)
        showRepo.save(testShow)
        seasonRepo = new SQLite3SeasonRepository(db)
    })

    afterEach(async () => {
        db.close()
    })

    it("save a Season and retrieves it using the find method", async () => {
        const season = Season.create(testShow.id, new SeasonNumber(1))
        await seasonRepo.save(season)
        const foundSeason = await seasonRepo.find(season.id)
        expect(season).toEqual(foundSeason)
    })

    it("throws a NotFoundError for an id that does not exist", async () => {
        const seasonId = "nonexistent-id"
        const expectedError = new NotFoundError(
            "Season not found",
            "SEASON_NOT_FOUND_ERROR",
            { id: seasonId }
        )
        await expect(seasonRepo.find(seasonId)).rejects.toThrow(expectedError)
    })

    it("throws an Error if a duplicate seasonNumber is saved for a given showId", async () => {
        const season = Season.create(testShow.id, new SeasonNumber(1))
        const dupeSeason = Season.create(testShow.id, new SeasonNumber(1))

        await seasonRepo.save(season)
        await expect(seasonRepo.save(dupeSeason)).rejects.toThrow()
    })

    it("finds all saved Seasons using the findAll method", async () => {
        const season1 = Season.create(testShow.id, new SeasonNumber(1))
        const season2 = Season.create(testShow.id, new SeasonNumber(2))

        await seasonRepo.save(season1)
        await seasonRepo.save(season2)

        const foundSeasons = await seasonRepo.findAll()
        expect(foundSeasons).toHaveLength(2)
        expect(foundSeasons).toContainEqual(season1)
        expect(foundSeasons).toContainEqual(season2)
    })

    it("deletes a saved Season", async () => {
        const season = Season.create(testShow.id, new SeasonNumber(1))
        const expectedError = new NotFoundError(
            "Season not found",
            "SEASON_NOT_FOUND_ERROR",
            { id: season.id }
        )

        await seasonRepo.save(season)

        await seasonRepo.delete(season.id)
        await expect(seasonRepo.find(season.id)).rejects.toThrow(expectedError)
    })

    it("throws a NotFoundError when trying to delete a Season that does not exist", async () => {
        const seasonId = "nonexistent-id"
        const expectedError = new NotFoundError(
            "Season not found",
            "SEASON_NOT_FOUND_ERROR",
            { id: seasonId }
        )
        await expect(seasonRepo.delete(seasonId)).rejects.toThrow(expectedError)
    })
})
