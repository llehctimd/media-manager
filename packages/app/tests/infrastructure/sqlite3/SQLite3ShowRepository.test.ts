import { Show } from "@/domain/model/Show.js"
import type { ShowRepository } from "@/domain/repository/ShowRepository.js"
import { NotFoundError } from "@/errors.js"
import { SQLite3ShowRepository } from "@/infrastructure/sqlite3/SQLite3ShowRepository.js"
import type { Database } from "better-sqlite3"
import { createTestSQLite3Database } from "tests/helpers/sqlite3-database.js"

describe("tests SQLite3ShowRepository persistence", () => {
    let showRepo: ShowRepository
    let db: Database
    beforeEach(async () => {
        db = createTestSQLite3Database()
        showRepo = new SQLite3ShowRepository(db)
    })

    afterEach(async () => {
        db.close()
    })

    it("saves a Show and retrieves it using the find method", async () => {
        const show = Show.create("Test Show", 2026)
        await showRepo.save(show)
        const foundShow = await showRepo.find(show.id)
        expect(show).toEqual(foundShow)
    })

    it("throws a NotFoundError for an id that does not exist", async () => {
        const showId = "nonexistent-id"
        const expectedError = new NotFoundError(
            "Show not found",
            "SHOW_NOT_FOUND_ERROR",
            { id: showId }
        )
        await expect(showRepo.find(showId)).rejects.toThrow(expectedError)
    })

    it("finds all saved Shows using the findAll method", async () => {
        const show1 = Show.create("Test Show 1", 2025)
        const show2 = Show.create("Test Show 2", null)

        await showRepo.save(show1)
        await showRepo.save(show2)

        const foundShows = await showRepo.findAll()
        expect(foundShows).toHaveLength(2)
        expect(foundShows).toContainEqual(show1)
        expect(foundShows).toContainEqual(show2)
    })

    it("deletes a saved Show", async () => {
        const show = Show.create("Test Show", 2026)
        const expectedError = new NotFoundError(
            "Show not found",
            "SHOW_NOT_FOUND_ERROR",
            { id: show.id }
        )

        await showRepo.save(show)

        await showRepo.delete(show.id)
        await expect(showRepo.find(show.id)).rejects.toThrow(expectedError)
    })

    it("throws a NotFoundError when trying to delete a Show that does not exist", async () => {
        const showId = "nonexistent-id"
        const expectedError = new NotFoundError(
            "Show not found",
            "SHOW_NOT_FOUND_ERROR",
            { id: showId }
        )
        await expect(showRepo.delete(showId)).rejects.toThrow(expectedError)
    })
})
