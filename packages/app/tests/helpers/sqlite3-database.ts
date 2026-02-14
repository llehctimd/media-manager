import Database from "better-sqlite3"
import type { Database as BetterSqlite3Database } from "better-sqlite3"
import schema from "@/infrastructure/sqlite3/schema/schema.sql?raw"

export function createTestSQLite3Database(): BetterSqlite3Database {
    const db = new Database(":memory:")
    db.exec(schema)
    return db
}
