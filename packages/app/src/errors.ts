export abstract class AppError extends Error {
    public readonly code: string
    public readonly details?: unknown

    protected constructor(message: string, code: string, details?: unknown) {
        super(message)
        this.code = code
        this.details = details

        Object.setPrototypeOf(this, AppError.prototype)
    }
}

export class DomainError extends AppError {
    constructor(message: string, code = "DOMAIN_ERROR", details?: unknown) {
        super(message, code, details)

        Object.setPrototypeOf(this, DomainError.prototype)
    }
}

export class NotFoundError extends AppError {
    constructor(message: string, code = "NOT_FOUND_ERROR", details?: unknown) {
        super(message, code, details)

        Object.setPrototypeOf(this, NotFoundError.prototype)
    }
}