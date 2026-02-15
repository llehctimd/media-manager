import type { ShowService } from "@/application/ShowService.js"
import type { Mock } from "vitest"

export type MockShowService = ShowService & {
    [key in keyof ShowService]: Mock
}

export function createMockShowService(): MockShowService {
    return {
        createShow: vi.fn(),
        getShowById: vi.fn(),
        getAllShows: vi.fn(),
        updateShow: vi.fn(),
        deleteShow: vi.fn(),
    } as MockShowService
}
