import { Episode, EpisodeNumber } from "@/domain/model/Episode.js"
import { DomainError } from "@/errors.js"

describe("test EpisodeNumber value object", () => {
    it("successfully creates a new EpisodeNumber using constructor if number >= 1", () => {
        new EpisodeNumber(1)
        new EpisodeNumber(2)
    })

    it("should throw a DomainError if the number passed to constructor is < 1", () => {
        const expectedError = new DomainError(
            "Episode number must be greater than 0",
            "EPISODENUMBER_DOMAIN_ERROR",
            { episodeNumber: 0 }
        )
        expect(() => new EpisodeNumber(0)).toThrow(expectedError)
    })
})

describe("test Episode domain model", () => {
    it("successfully creates a new episode using constructor", () => {
        new Episode("episode-id-1", "show-id", "season-id", new EpisodeNumber(1))
    })

    it("successfully creates a new episode using static create method", () => {
        Episode.create("show-id", "season-id", new EpisodeNumber(1))
    })
})