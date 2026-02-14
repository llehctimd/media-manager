import { Episode, EpisodeNumber } from "@/domain/model/Episode.js"
import type { EpisodeRepository } from "@/domain/repository/EpisodeRepository.js"

export interface EpisodeDTO {
    id: string
    showId: string
    seasonId: string
    episodeNumber: number
}

export interface EpisodeServiceCreateProps {
    showId: string
    seasonId: string
    episodeNumber: number
}

export interface EpisodeServiceGetEpisodeByIdProps {
    id: string
}

export interface EpisodeServiceUpdateEpisodeProps {
    id: string
    showId?: string
    seasonId?: string
    episodeNumber?: number
}

export interface EpisodeServiceDeleteEpisodeProps {
    id: string
}

export class EpisodeService {
    private _episodeRepo: EpisodeRepository

    constructor(episodeRepo: EpisodeRepository) {
        this._episodeRepo = episodeRepo
    }

    async createEpisode({
        showId,
        seasonId,
        episodeNumber,
    }: EpisodeServiceCreateProps): Promise<EpisodeDTO> {
        const episode = Episode.create(
            showId,
            seasonId,
            new EpisodeNumber(episodeNumber)
        )
        await this._episodeRepo.save(episode)
        return {
            id: episode.id,
            showId: episode.showId,
            seasonId: episode.seasonId,
            episodeNumber: episode.episodeNumber.number,
        }
    }

    async getEpisodeById({
        id,
    }: EpisodeServiceGetEpisodeByIdProps): Promise<EpisodeDTO> {
        const episode = await this._episodeRepo.find(id)
        return {
            id: episode.id,
            showId: episode.showId,
            seasonId: episode.seasonId,
            episodeNumber: episode.episodeNumber.number,
        }
    }

    async getAllEpisodes(): Promise<EpisodeDTO[]> {
        const episodes = await this._episodeRepo.findAll()
        return episodes.map((episode) => ({
            id: episode.id,
            showId: episode.showId,
            seasonId: episode.seasonId,
            episodeNumber: episode.episodeNumber.number,
        }))
    }

    async updateEpisode({
        id,
        showId,
        seasonId,
        episodeNumber,
    }: EpisodeServiceUpdateEpisodeProps): Promise<void> {
        const episode = await this._episodeRepo.find(id)
        if (showId !== undefined) {
            episode.showId = showId
        }
        if (seasonId !== undefined) {
            episode.seasonId = seasonId
        }
        if (episodeNumber !== undefined) {
            episode.episodeNumber = new EpisodeNumber(episodeNumber)
        }
        await this._episodeRepo.save(episode)
    }

    async deleteEpisode({
        id,
    }: EpisodeServiceDeleteEpisodeProps): Promise<void> {
        await this._episodeRepo.delete(id)
    }
}
