import type { Logger } from "@/infrastructure/logging/Logger.js"
import type { Mock } from "vitest"

export type MockLogger = Logger & {
    info: Mock
    warn: Mock
    debug: Mock
    error: Mock
}

export function createMockLogger(): MockLogger {
    return {
        info: vi.fn(),
        warn: vi.fn(),
        debug: vi.fn(),
        error: vi.fn(),
    } as MockLogger
}
