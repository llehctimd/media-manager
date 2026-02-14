import type { Episode } from "@/domain/model/Episode.js"

export interface EpisodeRepository {
    find(id: string): Promise<Episode>
    findAll(): Promise<Episode[]>
    save(episode: Episode): Promise<void>
    delete(id: string): Promise<void>
}
