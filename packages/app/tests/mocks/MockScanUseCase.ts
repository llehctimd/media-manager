import type { ScanUseCase } from "@/application/ScanUseCase.js"
import type { Mock } from "vitest"

export type MockScanUseCase = ScanUseCase & {
    queueScan: Mock
    getScan: Mock
}

export function createMockScanUseCase(): MockScanUseCase {
    return {
        queueScan: vi.fn(),
        getScan: vi.fn(),
    } as MockScanUseCase
}
