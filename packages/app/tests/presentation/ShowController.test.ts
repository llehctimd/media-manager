import type { ShowServiceCreateProps } from "@/application/ShowService.js"
import { NotFoundError } from "@/errors.js"
import { ShowController } from "@/presentation/ShowController.js"
import {
    createMockRequest,
    type MockRequest,
} from "tests/mocks/express/MockRequest.js"
import {
    createMockResponse,
    type MockReponse,
} from "tests/mocks/express/MockResponse.js"
import {
    createMockShowService,
    type MockShowService,
} from "tests/mocks/services/MockShowService.js"

let mockRequest: MockRequest
let mockResponse: MockReponse
let mockShowService: MockShowService
let showController: ShowController

beforeEach(async () => {
    mockRequest = createMockRequest()
    mockResponse = createMockResponse()
    mockShowService = createMockShowService()
    showController = new ShowController(mockShowService)
})

afterEach(async () => {})

describe("tests ShowController createShow method", () => {
    it("should return status 201 with show json DTO in response with good body", async () => {
        const requestBody = {
            title: "Test Show",
            year: 2026,
        }
        mockShowService.createShow.mockImplementation(
            (opts: ShowServiceCreateProps) => {
                return {
                    id: "show-id",
                    title: opts.title,
                    year: opts.year === undefined ? null : opts.year,
                }
            }
        )
        mockRequest.body = requestBody
        await showController.createShow(mockRequest, mockResponse)
        expect(mockShowService.createShow).toHaveBeenCalledExactlyOnceWith(
            requestBody
        )
        expect(mockResponse.status).toHaveBeenCalledExactlyOnceWith(201)
        expect(mockResponse.json).toHaveBeenCalledExactlyOnceWith({
            id: "show-id",
            title: "Test Show",
            year: 2026,
        })
    })

    it("should return status 400 with error message in response with null year", async () => {
        const requestBody = {
            title: "Test Show",
            year: null,
        }
        mockRequest.body = requestBody
        await showController.createShow(mockRequest, mockResponse)
        expect(mockShowService.createShow).toHaveBeenCalledTimes(0)
        expect(mockResponse.status).toHaveBeenCalledExactlyOnceWith(400)
        expect(mockResponse.json).toHaveBeenCalledExactlyOnceWith({
            message: "Invalid request body",
        })
    })

    it("should return status 201 with show json DTO in response with year omitted", async () => {
        const requestBody = {
            title: "Test Show",
        }
        mockShowService.createShow.mockImplementation(
            (opts: ShowServiceCreateProps) => {
                return {
                    id: "show-id",
                    title: opts.title,
                    year: opts.year === undefined ? null : opts.year,
                }
            }
        )
        mockRequest.body = requestBody
        await showController.createShow(mockRequest, mockResponse)
        expect(mockShowService.createShow).toHaveBeenCalledExactlyOnceWith(
            requestBody
        )
        expect(mockResponse.status).toHaveBeenCalledExactlyOnceWith(201)
        expect(mockResponse.json).toHaveBeenCalledExactlyOnceWith({
            id: "show-id",
            title: "Test Show",
            year: null,
        })
    })

    it("should return status 500 with error message in response if service method throws", async () => {
        const requestBody = {
            title: "Test Show",
            year: 2026,
        }
        mockShowService.createShow.mockImplementation(() => {
            throw new Error("Some error that was thrown")
        })
        mockRequest.body = requestBody
        await showController.createShow(mockRequest, mockResponse)
        expect(mockShowService.createShow).toHaveBeenCalledExactlyOnceWith(
            requestBody
        )
        expect(mockResponse.status).toHaveBeenCalledExactlyOnceWith(500)
        expect(mockResponse.json).toHaveBeenCalledExactlyOnceWith({
            message: "Unknown server error",
        })
    })
})

describe("tests ShowController getShowById method", () => {
    it("should return status 200 and json show DTO in response if show is found", async () => {
        const requestParams = {
            id: "show-id-1",
        }
        mockShowService.getShowById.mockImplementation(
            ({ id }: { id: string }) => ({
                id,
                title: "Test Show",
                year: 2026,
            })
        )
        mockRequest.params = requestParams
        await showController.getShowById(mockRequest, mockResponse)
        expect(mockShowService.getShowById).toHaveBeenCalledExactlyOnceWith(
            requestParams
        )
        expect(mockResponse.status).toHaveBeenCalledExactlyOnceWith(200)
        expect(mockResponse.json).toHaveBeenCalledExactlyOnceWith({
            id: "show-id-1",
            title: "Test Show",
            year: 2026,
        })
    })

    it("should return status 400 and error json if invalid request params", async () => {
        const requestParams = {
            identifier: "hello",
        }
        mockRequest.params = requestParams
        await showController.getShowById(mockRequest, mockResponse)
        expect(mockShowService.getShowById).toHaveBeenCalledTimes(0)
        expect(mockResponse.status).toHaveBeenCalledExactlyOnceWith(400)
        expect(mockResponse.json).toHaveBeenCalledExactlyOnceWith({
            message: "Invalid request params",
        })
    })

    it("should return status 404 and error json if no show found with id", async () => {
        const requestParams = {
            id: "nonexistent-id",
        }
        mockShowService.getShowById.mockImplementation(() => {
            throw new NotFoundError("Show not found", "SHOW_NOT_FOUND_ERROR")
        })
        mockRequest.params = requestParams
        await showController.getShowById(mockRequest, mockResponse)
        expect(mockShowService.getShowById).toHaveBeenCalledExactlyOnceWith(
            requestParams
        )
        expect(mockResponse.status).toHaveBeenCalledExactlyOnceWith(404)
        expect(mockResponse.json).toHaveBeenCalledExactlyOnceWith({
            message: "Show not found",
        })
    })

    it("should return status 500 and error json if other error occurs", async () => {
        const requestParams = {
            id: "show-id",
        }
        mockShowService.getShowById.mockImplementation(() => {
            throw new Error("Generic error type")
        })
        mockRequest.params = requestParams
        await showController.getShowById(mockRequest, mockResponse)
        expect(mockShowService.getShowById).toHaveBeenCalledExactlyOnceWith(
            requestParams
        )
        expect(mockResponse.status).toHaveBeenCalledExactlyOnceWith(500)
        expect(mockResponse.json).toHaveBeenCalledExactlyOnceWith({
            message: "Unknown server error",
        })
    })
})

describe("tests ShowController getAllShows method", () => {
    it("should return status 200 and the array of show DTOs found", async () => {
        const showDTOArray = [
            {
                id: "show-id-1",
                title: "Test Show 1",
                year: 2026,
            },
            {
                id: "show-id-2",
                title: "Test Show 2",
                year: null,
            },
        ]
        mockShowService.getAllShows.mockImplementation(() => {
            return showDTOArray
        })
        await showController.getAllShows(mockRequest, mockResponse)
        expect(mockShowService.getAllShows).toHaveBeenCalledOnce()
        expect(mockResponse.status).toHaveBeenCalledExactlyOnceWith(200)
        expect(mockResponse.json).toHaveBeenCalledExactlyOnceWith(showDTOArray)
    })

    it("should return status 500 and error json if an error occurs", async () => {
        mockShowService.getAllShows.mockImplementation(() => {
            throw new Error("Unknown error")
        })
        await showController.getAllShows(mockRequest, mockResponse)
        expect(mockShowService.getAllShows).toHaveBeenCalledOnce()
        expect(mockResponse.status).toHaveBeenCalledExactlyOnceWith(500)
        expect(mockResponse.json).toHaveBeenCalledExactlyOnceWith({
            message: "Unknown server error",
        })
    })
})

describe("tests ShowController updateShow method", () => {
    it("should return status 200 if updated successfully", async () => {
        const requestParams = {
            id: "show-id",
        }
        const requestBody = {
            title: "New Title",
            year: 2026,
        }
        mockRequest.params = requestParams
        mockRequest.body = requestBody
        await showController.updateShow(mockRequest, mockResponse)
        expect(mockShowService.updateShow).toHaveBeenCalledExactlyOnceWith({
            id: "show-id",
            title: "New Title",
            year: 2026,
        })
        expect(mockResponse.status).toHaveBeenCalledExactlyOnceWith(200)
        expect(mockResponse.json).toHaveBeenCalledExactlyOnceWith()
    })

    it("should return status 200 if updated successfully, only year", async () => {
        const requestParams = {
            id: "show-id",
        }
        const requestBody = {
            year: null,
        }
        mockRequest.params = requestParams
        mockRequest.body = requestBody
        await showController.updateShow(mockRequest, mockResponse)
        expect(mockShowService.updateShow).toHaveBeenCalledExactlyOnceWith({
            id: "show-id",
            year: null,
        })
        expect(mockResponse.status).toHaveBeenCalledExactlyOnceWith(200)
        expect(mockResponse.json).toHaveBeenCalledExactlyOnceWith()
    })

    it("should return status 400 if params invalid", async () => {
        const requestParams = {
            identifier: "show-id",
        }
        mockRequest.params = requestParams
        await showController.updateShow(mockRequest, mockResponse)
        expect(mockResponse.status).toHaveBeenCalledExactlyOnceWith(400)
        expect(mockResponse.json).toHaveBeenCalledExactlyOnceWith({
            message: "Invalid request params",
        })
    })

    it("should return status 400 if params body", async () => {
        const requestParams = {
            id: "show-id",
        }
        const requestBody = {
            episodeNumber: 10,
        }
        mockRequest.params = requestParams
        mockRequest.body = requestBody
        await showController.updateShow(mockRequest, mockResponse)
        expect(mockResponse.status).toHaveBeenCalledExactlyOnceWith(400)
        expect(mockResponse.json).toHaveBeenCalledExactlyOnceWith({
            message: "Invalid request body",
        })
    })

    it("should return status 404 if no show found to update", async () => {
        const requestParams = {
            id: "nonexistent-id",
        }
        const requestBody = {
            title: "New Title",
            year: 2020,
        }
        mockRequest.params = requestParams
        mockRequest.body = requestBody
        mockShowService.updateShow.mockImplementation(() => {
            throw new NotFoundError("Show not found", "SHOW_NOT_FOUND_ERROR")
        })
        await showController.updateShow(mockRequest, mockResponse)
        expect(mockShowService.updateShow).toHaveBeenCalledExactlyOnceWith({
            id: "nonexistent-id",
            title: "New Title",
            year: 2020,
        })
        expect(mockResponse.status).toHaveBeenCalledExactlyOnceWith(404)
        expect(mockResponse.json).toHaveBeenCalledExactlyOnceWith({
            message: "Show not found",
        })
    })

    it("should return status 500 if another error occurs", async () => {
        const requestParams = {
            id: "show-id",
        }
        const requestBody = {
            title: "New Title",
            year: 2020,
        }
        mockRequest.params = requestParams
        mockRequest.body = requestBody
        mockShowService.updateShow.mockImplementation(() => {
            throw new Error("Some other error")
        })
        await showController.updateShow(mockRequest, mockResponse)
        expect(mockShowService.updateShow).toHaveBeenCalledExactlyOnceWith({
            id: "show-id",
            title: "New Title",
            year: 2020,
        })
        expect(mockResponse.status).toHaveBeenCalledExactlyOnceWith(500)
        expect(mockResponse.json).toHaveBeenCalledExactlyOnceWith({
            message: "Unknown server error",
        })
    })
})

describe("tests ShowController deleteShow method", () => {
    it("should return status 200 if show was delete", async () => {
        const requestParams = {
            id: "show-id",
        }
        mockRequest.params = requestParams
        await showController.deleteShow(mockRequest, mockResponse)
        expect(mockShowService.deleteShow).toHaveBeenCalledExactlyOnceWith({
            id: "show-id",
        })
        expect(mockResponse.status).toHaveBeenCalledExactlyOnceWith(200)
        expect(mockResponse.json).toHaveBeenCalledExactlyOnceWith()
    })

    it("should return status 400 if invalid params", async () => {
        const requestParams = {
            identifier: "show-id",
        }
        mockRequest.params = requestParams
        await showController.deleteShow(mockRequest, mockResponse)
        expect(mockResponse.status).toHaveBeenCalledExactlyOnceWith(400)
        expect(mockResponse.json).toHaveBeenCalledExactlyOnceWith({
            message: "Invalid request params",
        })
    })

    it("should return status 404 if no show found to delete", async () => {
        const requestParams = {
            id: "show-id",
        }
        mockRequest.params = requestParams
        mockShowService.deleteShow.mockImplementation(() => {
            throw new NotFoundError("Show not found", "SHOW_NOT_FOUND_ERROR")
        })
        await showController.deleteShow(mockRequest, mockResponse)
        expect(mockResponse.status).toHaveBeenCalledExactlyOnceWith(404)
        expect(mockResponse.json).toHaveBeenCalledExactlyOnceWith({
            message: "Show not found",
        })
    })

    it("should return status 500 on other error", async () => {
        const requestParams = {
            id: "show-id",
        }
        mockRequest.params = requestParams
        mockShowService.deleteShow.mockImplementation(() => {
            throw new Error("Some other error")
        })
        await showController.deleteShow(mockRequest, mockResponse)
        expect(mockResponse.status).toHaveBeenCalledExactlyOnceWith(500)
        expect(mockResponse.json).toHaveBeenCalledExactlyOnceWith({
            message: "Unknown server error",
        })
    })
})
