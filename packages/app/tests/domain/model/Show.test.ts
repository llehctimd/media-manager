import { Show } from "@/domain/model/Show.js"
import { DomainError } from "@/errors.js"

describe("test Show domain model", () => {
    it("successfully creates a new Show using constructor", () => {
        new Show("show-id-1", "Show Title 1", 2026)
        new Show("show-id-2", "Show Title 2", null)
    })

    it("should throw a DomainError if the title is an empty string using constructor", () => {
        const expectedError = new DomainError(
            "Show title cannot be blank",
            "SHOW_DOMAIN_ERROR",
            {
                title: "",
            }
        )
        expect(() => new Show("show-id", "", null)).toThrow(expectedError)
    })

    it("successfully creates a new Show using static create method", () => {
        Show.create("Show Title 1", 2026)
        Show.create("Show Title 2", null)
    })

    it("should throw a DomainError if the title is an empty string using static create method", () => {
        const expectedError = new DomainError(
            "Show title cannot be blank",
            "SHOW_DOMAIN_ERROR",
            {
                title: "",
            }
        )
        expect(() => Show.create("", null)).toThrow(expectedError)
    })
})
