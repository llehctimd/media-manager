import { Episode, EpisodeNumber } from "@/domain/model/Episode.js"
import type { EpisodeRepository } from "@/domain/repository/EpisodeRepository.js"
import { NotFoundError } from "@/errors.js"
import type { Database } from "better-sqlite3"

interface EpisodeTableRow {
    id: string
    showId: string
    seasonId: string
    episodeNumber: number
}

export class SQLIte3EpisodeRepository implements EpisodeRepository {
    private _db: Database

    constructor(database: Database) {
        this._db = database
    }

    async find(id: string): Promise<Episode> {
        const select = this._db.prepare<unknown[], EpisodeTableRow>(`
            SELECT id, showId, seasonId, episodeNumber FROM episodes WHERE id = ?;
        `)
        const res = select.get(id)
        if (res === undefined) {
            throw new NotFoundError(
                "Episode not found",
                "EPISODE_NOT_FOUND_ERROR",
                {
                    id,
                }
            )
        }
        return new Episode(
            res.id,
            res.showId,
            res.seasonId,
            new EpisodeNumber(res.episodeNumber)
        )
    }

    async findAll(): Promise<Episode[]> {
        const select = this._db.prepare<unknown[], EpisodeTableRow>(`
            SELECT id, showId, seasonId, episodeNumber FROM episodes;
        `)
        const res = select.all()
        return res.map(
            (row) =>
                new Episode(
                    row.id,
                    row.showId,
                    row.seasonId,
                    new EpisodeNumber(row.episodeNumber)
                )
        )
    }

    async save(episode: Episode): Promise<void> {
        const upsert = this._db.prepare(`
            INSERT INTO episodes (id, showId, seasonId, episodeNumber)
            VALUES (?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
                id = excluded.id,
                showId = excluded.showId,
                seasonId = excluded.seasonId,
                episodeNumber = excluded.episodeNumber
        `)
        upsert.run(
            episode.id,
            episode.showId,
            episode.seasonId,
            episode.episodeNumber.number
        )
    }

    async delete(id: string): Promise<void> {
        const del = this._db.prepare(`
            DELETE FROM episodes WHERE id = ?;
        `)
        const res = del.run(id)
        if (res.changes == 0) {
            throw new NotFoundError(
                "Episode not found",
                "EPISODE_NOT_FOUND_ERROR",
                {
                    id,
                }
            )
        }
    }
}
