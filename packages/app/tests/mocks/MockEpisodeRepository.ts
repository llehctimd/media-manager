import type { EpisodeRepository } from "@/domain/repository/EpisodeRepository.js"
import type { Mock } from "vitest"

export type MockEpisodeRepository = EpisodeRepository & {
    [key in keyof EpisodeRepository]: Mock
}

export function createMockEpisodeRepository(): MockEpisodeRepository {
    return {
        find: vi.fn(),
        findAll: vi.fn(),
        save: vi.fn(),
        delete: vi.fn(),
    }
}
