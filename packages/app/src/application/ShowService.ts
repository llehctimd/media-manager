import { Show } from "@/domain/model/Show.js"
import type { ShowRepository } from "@/domain/repository/ShowRepository.js"

export interface ShowDTO {
    id: string
    title: string
    year: number | null
}

export interface ShowServiceCreateProps {
    title: string
    year?: number
}

export interface ShowServiceGetShowByIdProps {
    id: string
}

export interface ShowServiceUpdateShowProps {
    id: string
    title?: string 
    year?: number | null
}

export interface ShowServiceDeleteShowProps {
    id: string
}

export class ShowService {
    private _showRepo: ShowRepository

    constructor(showRepo: ShowRepository) {
        this._showRepo = showRepo
    }

    async createShow({
        title,
        year,
    }: ShowServiceCreateProps): Promise<ShowDTO> {
        const showYear = year === undefined ? null : year
        const show = Show.create(title, showYear)
        await this._showRepo.save(show)
        return {
            id: show.id,
            title: show.title,
            year: show.year,
        }
    }

    async getShowById({ id }: ShowServiceGetShowByIdProps): Promise<ShowDTO> {
        const show = await this._showRepo.find(id)
        return {
            id: show.id,
            title: show.title,
            year: show.year,
        }
    }

    async getAllShows(): Promise<ShowDTO[]> {
        const shows = await this._showRepo.findAll()
        return shows.map((show) => ({
            id: show.id,
            title: show.title,
            year: show.year
        }))
    }

    async updateShow({
        id,
        title,
        year,
    }: ShowServiceUpdateShowProps): Promise<void> {
        const show = await this._showRepo.find(id)
        if (title !== undefined) {
            show.title = title
        }
        if (year !== undefined) {
            show.year = year
        }
        await this._showRepo.save(show)
    }

    async deleteShow({ id }: ShowServiceDeleteShowProps): Promise<void> {
        await this._showRepo.delete(id)
    }
}
