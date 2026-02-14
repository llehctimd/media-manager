import type { SeasonRepository } from "@/domain/repository/SeasonRepository.js"
import type { Mock } from "vitest"

export type MockSeasonRepository = SeasonRepository & {
    [key in keyof SeasonRepository]: Mock
}

export function createMockSeasonRepository(): MockSeasonRepository {
    return {
        find: vi.fn(),
        findAll: vi.fn(),
        save: vi.fn(),
        delete: vi.fn(),
    }
}
