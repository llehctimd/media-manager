import { Season, SeasonNumber } from "@/domain/model/Season.js"
import type { SeasonRepository } from "@/domain/repository/SeasonRepository.js"

export interface SeasonDTO {
    id: string
    showId: string
    seasonNumber: number
}

export interface SeasonServiceCreateProps {
    showId: string
    seasonNumber: number
}

export interface SeasonServiceGetSeasonByIdProps {
    id: string
}

export interface SeasonServiceUpdateSeasonProps {
    id: string
    showId?: string
    seasonNumber?: number
}

export interface SeasonServiceDeleteSeasonProps {
    id: string
}

export class SeasonService {
    private _seasonRepo: SeasonRepository

    constructor(seasonRepo: SeasonRepository) {
        this._seasonRepo = seasonRepo
    }

    async createSeason({
        showId,
        seasonNumber,
    }: SeasonServiceCreateProps): Promise<SeasonDTO> {
        const season = Season.create(showId, new SeasonNumber(seasonNumber))
        await this._seasonRepo.save(season)
        return {
            id: season.id,
            showId: season.showId,
            seasonNumber: season.seasonNumber.number,
        }
    }

    async getSeasonById({
        id,
    }: SeasonServiceGetSeasonByIdProps): Promise<SeasonDTO> {
        const season = await this._seasonRepo.find(id)
        return {
            id: season.id,
            showId: season.showId,
            seasonNumber: season.seasonNumber.number,
        }
    }

    async getAllSeasons(): Promise<SeasonDTO[]> {
        const seasons = await this._seasonRepo.findAll()
        return seasons.map((season) => ({
            id: season.id,
            showId: season.showId,
            seasonNumber: season.seasonNumber.number,
        }))
    }

    async updateSeason({
        id,
        showId,
        seasonNumber,
    }: SeasonServiceUpdateSeasonProps): Promise<void> {
        const season = await this._seasonRepo.find(id)
        if (showId !== undefined) {
            season.showId = showId
        }
        if (seasonNumber !== undefined) {
            season.seasonNumber = new SeasonNumber(seasonNumber)
        }
        await this._seasonRepo.save(season)
    }

    async deleteSeason({ id }: SeasonServiceDeleteSeasonProps): Promise<void> {
        await this._seasonRepo.delete(id)
    }
}
