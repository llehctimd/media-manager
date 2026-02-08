import type { MediaFileRepository } from "@/domain/media-files/MediaFileRepository.js"
import type { Mock } from "vitest"

export type MockMediaFileRepository = MediaFileRepository & {
    [key in keyof MediaFileRepository]: Mock
}

export function createMockMediaFileRepository(): MockMediaFileRepository {
    return {
        findById: vi.fn(),
        findByPath: vi.fn(),
        findAll: vi.fn(),
        save: vi.fn(),
        deleteNotScanId: vi.fn(),
    }
}
