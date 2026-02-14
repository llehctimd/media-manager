import { DomainError } from "@/errors.js"
import { v7 as uuidv7 } from "uuid"

export class Show {
    private _id: string
    private _title: string
    private _year: number | null

    constructor(id: string, title: string, year: number | null) {
        this._id = id
        if (title === "") {
            throw new DomainError("Show title cannot be blank", "SHOW_DOMAIN_ERROR", { title })
        }
        this._title = title
        this._year = year
    }

    static create(title: string, year: number | null) {
        return new Show(uuidv7(), title, year)
    }

    get id() {
        return this._id
    }

    get title() {
        return this._title
    }

    set title(title: string) {
        if (title === "") {

        }
    }

    get year() {
        return this._year
    }

    set year(year: number | null) {
        this._year = year
    }
}