import { Show } from "@/domain/model/Show.js"
import type { ShowRepository } from "@/domain/repository/ShowRepository.js"
import { NotFoundError } from "@/errors.js"
import type { Database } from "better-sqlite3"

interface ShowTableRow {
    id: string
    title: string
    year: number | null
}

export class SQLite3ShowRepository implements ShowRepository {
    private _db: Database

    constructor(database: Database) {
        this._db = database
    }
    async find(id: string): Promise<Show> {
        const select = this._db.prepare<unknown[], ShowTableRow>(`
            SELECT id, title, year FROM shows WHERE id = ?;
        `)
        const res = select.get(id)
        if (res === undefined) {
            throw new NotFoundError("Show not found", "SHOW_NOT_FOUND_ERROR", {
                id,
            })
        }
        return new Show(res.id, res.title, res.year)
    }

    async findAll(): Promise<Show[]> {
        const select = this._db.prepare<unknown[], ShowTableRow>(`
            SELECT id, title, year FROM shows;
        `)
        const res = select.all()
        return res.map((row) => new Show(row.id, row.title, row.year))
    }

    async save(show: Show): Promise<void> {
        const upsert = this._db.prepare(`
            INSERT INTO shows (id, title, year)
            VALUES (?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
                id = excluded.id,
                title = excluded.title,
                year = excluded.year
        `)
        upsert.run(show.id, show.title, show.year)
    }

    async delete(id: string): Promise<void> {
        const del = this._db.prepare(`
            DELETE FROM shows WHERE id = ?;
        `)
        const res = del.run(id)
        if (res.changes == 0) {
            throw new NotFoundError("Show not found", "SHOW_NOT_FOUND_ERROR", {
                id,
            })
        }
    }
}
