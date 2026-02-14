import { DomainError } from "@/errors.js"
import { v7 as uuidv7 } from "uuid"

export class SeasonNumber {
    private _number: number

    constructor(seasonNumber: number) {
        if (seasonNumber < 0) {
            throw new DomainError(
                "Season number cannot be negative",
                "SEASONNUMBER_DOMAIN_ERROR",
                { seasonNumber }
            )
        }
        this._number = seasonNumber
    }

    get number() {
        return this._number
    }
}

export class Season {
    private _id: string
    private _showId: string
    private _seasonNumber: SeasonNumber

    constructor(id: string, showId: string, seasonNumber: SeasonNumber) {
        this._id = id
        this._showId = showId
        this._seasonNumber = seasonNumber
    }

    static create(showId: string, seasonNumber: SeasonNumber) {
        return new Season(uuidv7(), showId, seasonNumber)
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

    get seasonNumber() {
        return this._seasonNumber
    }

    set seasonNumber(seasonNumber: SeasonNumber) {
        this._seasonNumber = seasonNumber
    }
}
