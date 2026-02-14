import type { ShowRepository } from "@/domain/repository/ShowRepository.js"
import type { Mock } from "vitest"

export type MockShowRepository = ShowRepository & {
    [key in keyof ShowRepository]: Mock
}

export function createMockShowRepository(): MockShowRepository {
    return {
        find: vi.fn(),
        findAll: vi.fn(),
        save: vi.fn(),
        delete: vi.fn(),
    }
}
