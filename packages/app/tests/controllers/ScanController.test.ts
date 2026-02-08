import { ScanController } from "@/controllers/ScanController.js"
import {
    createMockScanUseCase,
    type MockScanUseCase,
} from "../mocks/MockScanUseCase.js"
import {
    createMockRequest,
    createMockResponse,
} from "tests/mocks/MockExpress.js"

describe("test ScanController", () => {
    let scanController: ScanController
    let mockScanUseCase: MockScanUseCase

    beforeEach(async () => {
        mockScanUseCase = createMockScanUseCase()
        scanController = new ScanController(mockScanUseCase)
    })

    afterEach(async () => {})

    it("tests queueScan handles a correct body", async () => {
        const path = "path/to/dir"
        const req = createMockRequest()
        req.body = { path }
        const res = createMockResponse()

        const scanJSON = {
            id: "test-id",
            path,
            status: "queued",
        }
        const mockScan = {
            toJSON: () => scanJSON,
        }
        mockScanUseCase.queueScan.mockImplementation(() => mockScan)

        await scanController.queueScan(req, res)

        expect(mockScanUseCase.queueScan).toHaveBeenCalledExactlyOnceWith(path)
        expect(res.status).toHaveBeenCalledExactlyOnceWith(201)
        expect(res.json).toHaveBeenCalledExactlyOnceWith(scanJSON)
    })

    it("tests getScan handles a correct body", async () => {
        const id = "id-1"
        const req = createMockRequest()
        req.params = { id }
        const res = createMockResponse()

        const scanJSON = {
            id,
            path: "path/to/file",
            status: "queued",
        }
        const mockScan = {
            toJSON: () => scanJSON,
        }
        mockScanUseCase.getScan.mockImplementation(() => mockScan)

        await scanController.getScan(req, res)

        expect(mockScanUseCase.getScan).toHaveBeenCalledExactlyOnceWith(id)
        expect(res.status).toHaveBeenCalledExactlyOnceWith(200)
        expect(res.json).toHaveBeenCalledExactlyOnceWith(scanJSON)
    })
})
