import type { Request } from "express"

export type MockRequest = Request

export function createMockRequest(): MockRequest {
    const req: Partial<Request> = {}
    return req as MockRequest
}
