import type { Season } from "../model/Season.js";

export interface SeasonRepository {
    find(id: string): Promise<Season>
    findAll(): Promise<Season[]>
    save(season: Season): Promise<void>
    delete(id: string): Promise<void>
}