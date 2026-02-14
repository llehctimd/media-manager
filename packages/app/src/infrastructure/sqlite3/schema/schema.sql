CREATE TABLE IF NOT EXISTS shows (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    year INTEGER
);

CREATE TABLE IF NOT EXISTS seasons (
    id TEXT PRIMARY KEY,
    showId TEXT NOT NULL,
    seasonNumber INTEGER NOT NULL,
    FOREIGN KEY (showId) REFERENCES shows(id),
    CONSTRAINT unique_seasons_showId_seasonNumber UNIQUE(showId, seasonNumber)
);
