import { DomainError } from "@/errors.js"
import { v7 as uuidv7 } from "uuid"

export class EpisodeNumber {
    private _number: number

    constructor(episodeNumber: number) {
        if (episodeNumber < 1) {
            throw new DomainError(
                "Episode number must be greater than 0",
                "EPISODENUMBER_DOMAIN_ERROR",
                {
                    episodeNumber,
                }
            )
        }
        this._number = episodeNumber
    }

    get number() {
        return this._number
    }
}

export class Episode {
    private _id: string
    private _showId: string
    private _seasonId: string
    private _episodeNumber: EpisodeNumber

    constructor(
        id: string,
        showId: string,
        seasonId: string,
        episodeNumber: EpisodeNumber
    ) {
        this._id = id
        this._showId = showId
        this._seasonId = seasonId
        this._episodeNumber = episodeNumber
    }

    static create(
        showId: string,
        seasonId: string,
        episodeNumber: EpisodeNumber
    ) {
        return new Episode(uuidv7(), showId, seasonId, episodeNumber)
    }

    get id() {
        return this._id
    }

    get showId() {
        return this._showId
    }

    set showId(showId: string) {
        this._showId = showId
    }

    get seasonId() {
        return this._seasonId
    }

    set seasonId(seasonId: string) {
        this._seasonId = seasonId
    }

    get episodeNumber() {
        return this._episodeNumber
    }

    set episodeNumber(episodeNumber: EpisodeNumber) {
        this._episodeNumber = episodeNumber
    }
}
