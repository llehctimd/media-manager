import type { Show } from "../model/Show.js";

export interface ShowRepository {
    find(id: string): Promise<Show>
    findAll(): Promise<Show[]>
    save(show: Show): Promise<void>
    delete(id: string): Promise<void>
}