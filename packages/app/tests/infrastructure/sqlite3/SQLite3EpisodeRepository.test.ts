import { Episode, EpisodeNumber } from "@/domain/model/Episode.js"
import { Season, SeasonNumber } from "@/domain/model/Season.js"
import { Show } from "@/domain/model/Show.js"
import type { EpisodeRepository } from "@/domain/repository/EpisodeRepository.js"
import type { SeasonRepository } from "@/domain/repository/SeasonRepository.js"
import type { ShowRepository } from "@/domain/repository/ShowRepository.js"
import { NotFoundError } from "@/errors.js"
import { SQLIte3EpisodeRepository } from "@/infrastructure/sqlite3/SQLite3EpisodeRepository.js"
import { SQLite3SeasonRepository } from "@/infrastructure/sqlite3/SQLite3SeasonRepository.js"
import { SQLite3ShowRepository } from "@/infrastructure/sqlite3/SQLite3ShowRepository.js"
import type { Database } from "better-sqlite3"
import { createTestSQLite3Database } from "tests/helpers/sqlite3-database.js"

// Unfortunately coupled with ShowRepository & SeasonRepository because of foreign key constraint

describe("tests SQLite3EpisodeRepository persistence", () => {
    let testShow: Show
    let showRepo: ShowRepository
    let testSeason: Season
    let seasonRepo: SeasonRepository
    let episodeRepo: EpisodeRepository
    let db: Database

    beforeEach(async () => {
        db = createTestSQLite3Database()

        testShow = Show.create("Test Show", 2026)
        showRepo = new SQLite3ShowRepository(db)
        await showRepo.save(testShow)

        testSeason = Season.create(testShow.id, new SeasonNumber(1))
        seasonRepo = new SQLite3SeasonRepository(db)
        await seasonRepo.save(testSeason)

        episodeRepo = new SQLIte3EpisodeRepository(db)
    })

    afterEach(async () => {
        db.close()
    })

    it("save an Episode and retrieves it using the find method", async () => {
        const episode = Episode.create(
            testShow.id,
            testSeason.id,
            new EpisodeNumber(1)
        )
        await episodeRepo.save(episode)
        const foundEpisode = await episodeRepo.find(episode.id)
        expect(episode).toEqual(foundEpisode)
    })

    it("throws a NotFoundError for an id that does not exist", async () => {
        const episodeId = "nonexistent-id"
        const expectedError = new NotFoundError(
            "Episode not found",
            "EPISODE_NOT_FOUND_ERROR",
            { id: episodeId }
        )
        await expect(episodeRepo.find(episodeId)).rejects.toThrow(expectedError)
    })

    it("throws an Error if a duplicate episodeNumber is saved for a given showId and seasonId", async () => {
        const episode = Episode.create(
            testShow.id,
            testSeason.id,
            new EpisodeNumber(1)
        )
        const dupeEpisode = Episode.create(
            testShow.id,
            testSeason.id,
            new EpisodeNumber(1)
        )

        await episodeRepo.save(episode)
        await expect(episodeRepo.save(dupeEpisode)).rejects.toThrow()
    })

    it("finds all saved episodes using the findAll method", async () => {
        const episode1 = Episode.create(
            testShow.id,
            testSeason.id,
            new EpisodeNumber(1)
        )
        const episode2 = Episode.create(
            testShow.id,
            testSeason.id,
            new EpisodeNumber(2)
        )

        await episodeRepo.save(episode1)
        await episodeRepo.save(episode2)

        const foundEpisodes = await episodeRepo.findAll()
        expect(foundEpisodes).toHaveLength(2)
        expect(foundEpisodes).toContainEqual(episode1)
        expect(foundEpisodes).toContainEqual(episode2)
    })

    it("deletes a saved Episode", async () => {
        const episode = Episode.create(
            testShow.id,
            testSeason.id,
            new EpisodeNumber(1)
        )
        const expectedError = new NotFoundError(
            "Episode not found",
            "EPISODE_NOT_FOUND_ERROR",
            { id: episode.id }
        )

        await episodeRepo.save(episode)

        await episodeRepo.delete(episode.id)
        await expect(episodeRepo.find(episode.id)).rejects.toThrow(
            expectedError
        )
    })

    it("throws a NotFoundError when trying to delete an Episode that does not exist", async () => {
        const episodeId = "nonexistent-id"
        const expectedError = new NotFoundError(
            "Episode not found",
            "EPISODE_NOT_FOUND_ERROR",
            { id: episodeId }
        )
        await expect(episodeRepo.delete(episodeId)).rejects.toThrow(
            expectedError
        )
    })
})
