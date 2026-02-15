import type { Response } from "express"
import type { Mock } from "vitest"

export type MockReponse = Response & {
    status: Mock
    json: Mock
}

export function createMockResponse(): MockReponse {
    const res: Partial<Response> = {}
    res.status = vi.fn().mockReturnValue(res)
    res.json = vi.fn()
    return res as MockReponse
}
