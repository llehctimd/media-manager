import type { Request, Response } from "express"

export function createMockResponse() {
    const res: Partial<Response> = {}
    res.status = vi.fn().mockReturnValue(res)
    res.json = vi.fn()
    return res as Response
}

export function createMockRequest() {
    const req: Partial<Request> = {}
    return req as Request
}