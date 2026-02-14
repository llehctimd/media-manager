import { Season, SeasonNumber } from "@/domain/model/Season.js"
import { DomainError } from "@/errors.js"

describe("test SeasonNumber value object", () => {
    it("successfully creates a new SeasonNumber using constructor if number >= 0", () => {
        new SeasonNumber(0)
        new SeasonNumber(1)
    })

    it("should throw a DomainError if the number passed to constructor is < 0", () => {
        const expectedError = new DomainError(
            "Season number cannot be negative",
            "SEASONNUMBER_DOMAIN_ERROR",
            { seasonNumber: -1 }
        )
        expect(() => new SeasonNumber(-1)).toThrow(expectedError)
    })
})

describe("test Season domain model", () => {
    it("successfully creates a new season using constructor", () => {
        new Season("season-id-1", "show-id", new SeasonNumber(1))
    })

    it("successfully creates a new season using static create method", () => {
        Season.create("show-id", new SeasonNumber(1))
    })
})
