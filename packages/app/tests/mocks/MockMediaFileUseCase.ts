import type { MediaFileUseCase } from "@/application/MediaFileUseCase.js"
import type { Mock } from "vitest"

export type MockMediaFileUseCase = MediaFileUseCase & {
    [key in keyof MediaFileUseCase]: Mock
}

export function createMockMediaFileUseCase(): MockMediaFileUseCase {
    return {
        get: vi.fn(),
        getAll: vi.fn(),
    } as MockMediaFileUseCase
}
