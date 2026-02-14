import { Season, SeasonNumber } from "@/domain/model/Season.js"
import type { SeasonRepository } from "@/domain/repository/SeasonRepository.js"
import { NotFoundError } from "@/errors.js"
import type { Database } from "better-sqlite3"

interface SeasonTableRow {
    id: string
    showId: string
    seasonNumber: number
}

export class SQLite3SeasonRepository implements SeasonRepository {
    private _db: Database

    constructor(database: Database) {
        this._db = database
    }

    async find(id: string): Promise<Season> {
        const select = this._db.prepare<unknown[], SeasonTableRow>(`
            SELECT id, showId, seasonNumber FROM seasons WHERE id = ?;
        `)
        const res = select.get(id)
        if (res === undefined) {
            throw new NotFoundError(
                "Season not found",
                "SEASON_NOT_FOUND_ERROR",
                {
                    id,
                }
            )
        }
        return new Season(
            res.id,
            res.showId,
            new SeasonNumber(res.seasonNumber)
        )
    }

    async findAll(): Promise<Season[]> {
        const select = this._db.prepare<unknown[], SeasonTableRow>(`
            SELECT id, showId, seasonNumber FROM seasons;
        `)
        const res = select.all()
        return res.map(
            (row) =>
                new Season(
                    row.id,
                    row.showId,
                    new SeasonNumber(row.seasonNumber)
                )
        )
    }

    async save(season: Season): Promise<void> {
        const upsert = this._db.prepare(`
            INSERT INTO seasons (id, showId, seasonNumber)
            VALUES (?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
                id = excluded.id,
                showId = excluded.showId,
                seasonNumber = excluded.seasonNumber
        `)
        upsert.run(season.id, season.showId, season.seasonNumber.number)
    }

    async delete(id: string): Promise<void> {
        const del = this._db.prepare(`
            DELETE FROM seasons WHERE id = ?;
        `)
        const res = del.run(id)
        if (res.changes == 0) {
            throw new NotFoundError(
                "Season not found",
                "SEASON_NOT_FOUND_ERROR",
                {
                    id,
                }
            )
        }
    }
}
