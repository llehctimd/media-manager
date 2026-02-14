import { ShowService } from "@/application/ShowService.js"
import { Show } from "@/domain/model/Show.js"
import { NotFoundError } from "@/errors.js"
import { title } from "node:process"
import {
    createMockShowRepository,
    type MockShowRepository,
} from "tests/mocks/MockShowRepository.js"

let mockShowRepository: MockShowRepository
let showService: ShowService

beforeEach(async () => {
    mockShowRepository = createMockShowRepository()
    showService = new ShowService(mockShowRepository)
})

afterEach(async () => {})

describe("tests ShowService createShow", () => {
    it("should create a new Show, save to repo and return DTO", async () => {
        const showDTO = await showService.createShow({
            title: "Show Title",
            year: 2026,
        })
        const expectedDTO = {
            id: showDTO.id,
            title: "Show Title",
            year: 2026,
        }
        expect(mockShowRepository.save).toHaveBeenCalledOnce()
        expect(expectedDTO).toEqual(showDTO)
    })

    it("should return a null year if year is missing from props", async () => {
        const showDTO = await showService.createShow({
            title: "Show Title",
        })
        expect(showDTO.year).toBeNull()
    })
})

describe("tests ShowService getShowById", () => {
    it("should return the ShowDTO corresponding to the Show found in repo", async () => {
        const findId = "test-show-id"
        mockShowRepository.find.mockImplementation(
            (id: string) => new Show(id, "Show Title", 2026)
        )
        const expectedDTO = {
            id: findId,
            title: "Show Title",
            year: 2026,
        }

        const resultDTO = await showService.getShowById({ id: findId })
        expect(resultDTO).toEqual(expectedDTO)
        expect(mockShowRepository.find).toHaveBeenCalledExactlyOnceWith(findId)
    })

    it("should throw NotFoundError if repo find method does", async () => {
        const nonexistentId = "nonexistent-id"
        const expectedError = new NotFoundError(
            "Show not found",
            "SHOW_NOT_FOUND_ERROR",
            {
                id: nonexistentId,
            }
        )
        mockShowRepository.find.mockImplementation((id: string) => {
            throw new NotFoundError("Show not found", "SHOW_NOT_FOUND_ERROR", {
                id,
            })
        })

        await expect(
            showService.getShowById({ id: nonexistentId })
        ).rejects.toThrow(expectedError)
    })
})

describe("tests ShowService getAllShows", () => {
    it("should return shows found by repo findAll method", async () => {
        const shows = [
            Show.create("Show Title 1", 2026),
            Show.create("Show Title 2", null),
        ]
        mockShowRepository.findAll.mockImplementation(() => shows)

        const expectedDTOArray = [
            {
                id: shows[0]?.id,
                title: shows[0]?.title,
                year: shows[0]?.year,
            },
            {
                id: shows[1]?.id,
                title: shows[1]?.title,
                year: shows[1]?.year,
            },
        ]

        const showDTOArray = await showService.getAllShows()
        expect(mockShowRepository.findAll).toHaveBeenCalledOnce()
        expect(showDTOArray).toEqual(expectedDTOArray)
    })

    it("should return an empty array if no shows in repo", async () => {
        mockShowRepository.findAll.mockImplementation(() => [])

        const emptyDTOArray = await showService.getAllShows()
        expect(mockShowRepository.findAll).toHaveBeenCalledOnce()
        expect(emptyDTOArray).toEqual([])
    })
})

describe("tests ShowService updateShow", () => {
    it("should call repo find, modify the title and year on show entity and call save on it", async () => {
        const initialShow = Show.create("Initial Title", 2026)
        const updatedShow = new Show(initialShow.id, "New Title", 2020)

        mockShowRepository.find.mockImplementation(() => initialShow)

        await showService.updateShow({
            id: initialShow.id,
            title: "New Title",
            year: 2020,
        })

        expect(mockShowRepository.find).toHaveBeenCalledExactlyOnceWith(
            initialShow.id
        )
        expect(mockShowRepository.save).toHaveBeenCalledExactlyOnceWith(
            updatedShow
        )
    })

    it("should call repo find, modify only the title on show entity and call save on it", async () => {
        const initialShow = Show.create("Initial Title", 2026)
        const updatedShow = new Show(
            initialShow.id,
            "New Title",
            initialShow.year
        )

        mockShowRepository.find.mockImplementation(() => initialShow)

        await showService.updateShow({
            id: initialShow.id,
            title: "New Title",
        })

        expect(mockShowRepository.find).toHaveBeenCalledExactlyOnceWith(
            initialShow.id
        )
        expect(mockShowRepository.save).toHaveBeenCalledExactlyOnceWith(
            updatedShow
        )
    })

    it("should call repo find, modify only the year on show entity and call save on it", async () => {
        const initialShow = Show.create("Initial Title", 2026)
        const updatedShow = new Show(initialShow.id, "Initial Title", null)

        mockShowRepository.find.mockImplementation(() => initialShow)

        await showService.updateShow({
            id: initialShow.id,
            year: null,
        })

        expect(mockShowRepository.find).toHaveBeenCalledExactlyOnceWith(
            initialShow.id
        )
        expect(mockShowRepository.save).toHaveBeenCalledExactlyOnceWith(
            updatedShow
        )
    })
})

describe("tests ShowService deleteShow", () => {
    it("should call repo delete on id", async () => {
        const deleteId = "test-id"
        await showService.deleteShow({ id: deleteId })
        expect(mockShowRepository.delete).toHaveBeenCalledExactlyOnceWith(
            deleteId
        )
    })

    it("should throw NotFoundError if no shows are deleted", async () => {
        const deleteId = "test-id"
        const expectedError = new NotFoundError(
            "Show not found",
            "SHOW_NOT_FOUND_ERROR",
            { id: deleteId }
        )
        mockShowRepository.delete.mockImplementation((id: string) => {
            throw new NotFoundError("Show not found", "SHOW_NOT_FOUND_ERROR", {
                id,
            })
        })
        await expect(showService.deleteShow({ id: deleteId })).rejects.toThrow(expectedError)
        expect(mockShowRepository.delete).toHaveBeenCalledExactlyOnceWith(deleteId)
    })
})
