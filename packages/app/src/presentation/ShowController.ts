import type { ShowService } from "@/application/ShowService.js"
import { NotFoundError } from "@/errors.js"
import type { Request, Response } from "express"
import { z } from "zod"

const createShowBodySchema = z.union([
    z.strictObject({
        title: z.string(),
    }),
    z.strictObject({
        title: z.string(),
        year: z.number(),
    }),
])

const getShowByIdParamsSchema = z.strictObject({
    id: z.string(),
})

const updateShowParamsSchema = z.strictObject({
    id: z.string(),
})

const updateShowBodySchema = z
    .strictObject({
        title: z.string(),
        year: z.number().nullable(),
    })
    .partial()

const deleteShowParamsSchema = z.strictObject({
    id: z.string(),
})

export class ShowController {
    private _showService: ShowService

    constructor(showService: ShowService) {
        this._showService = showService
    }

    async createShow(req: Request, res: Response): Promise<any> {
        const parsed = createShowBodySchema.safeParse(req.body)
        if (!parsed.success) {
            return res.status(400).json({
                message: "Invalid request body",
            })
        }
        try {
            const showDTO = await this._showService.createShow(parsed.data)
            return res.status(201).json(showDTO)
        } catch (err) {
            return res.status(500).json({
                message: "Unknown server error",
            })
        }
    }

    async getShowById(req: Request, res: Response): Promise<any> {
        const parsed = getShowByIdParamsSchema.safeParse(req.params)
        if (!parsed.success) {
            return res.status(400).json({
                message: "Invalid request params",
            })
        }
        try {
            const showDTO = await this._showService.getShowById(parsed.data)
            return res.status(200).json(showDTO)
        } catch (err) {
            if (err instanceof NotFoundError) {
                return res.status(404).json({
                    message: err.message,
                })
            }
            return res.status(500).json({
                message: "Unknown server error",
            })
        }
    }

    async getAllShows(_: Request, res: Response): Promise<any> {
        try {
            const showDTOs = await this._showService.getAllShows()
            return res.status(200).json(showDTOs)
        } catch (err) {
            return res.status(500).json({
                message: "Unknown server error",
            })
        }
    }

    async updateShow(req: Request, res: Response): Promise<any> {
        const parsedParams = updateShowParamsSchema.safeParse(req.params)
        if (!parsedParams.success) {
            return res.status(400).json({
                message: "Invalid request params",
            })
        }
        const parsedBody = updateShowBodySchema.safeParse(req.body)
        if (!parsedBody.success) {
            return res.status(400).json({
                message: "Invalid request body",
            })
        }
        try {
            await this._showService.updateShow({
                ...parsedParams.data,
                ...(parsedBody.data.title !== undefined && {
                    title: parsedBody.data.title,
                }),
                ...(parsedBody.data.year !== undefined && {
                    year: parsedBody.data.year,
                }),
            })
            return res.status(200).json()
        } catch (err) {
            if (err instanceof NotFoundError) {
                return res.status(404).json({
                    message: err.message,
                })
            }
            return res.status(500).json({
                message: "Unknown server error",
            })
        }
    }

    async deleteShow(req: Request, res: Response): Promise<any> {
        const parsed = deleteShowParamsSchema.safeParse(req.params)
        if (!parsed.success) {
            return res.status(400).json({
                message: "Invalid request params",
            })
        }
        try {
            await this._showService.deleteShow(parsed.data)
            return res.status(200).json()
        } catch (err) {
            if (err instanceof NotFoundError) {
                return res.status(404).json({
                    message: err.message,
                })
            }
            return res.status(500).json({
                message: "Unknown server error",
            })
        }
    }
}
