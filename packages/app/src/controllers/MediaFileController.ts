import type { MediaFileUseCase } from "@/application/MediaFileUseCase.js"
import type { Request, Response } from "express"
import { z } from "zod"

const getParamsSchema = z.object({
    id: z.string()
})

export class MediaFileController {
    private _mediaFileUseCase: MediaFileUseCase

    constructor(mediaFileUseCase: MediaFileUseCase) {
        this._mediaFileUseCase = mediaFileUseCase
    }

    async get(req: Request, res: Response): Promise<any> {
        const params = getParamsSchema.safeParse(req.params)
        if (!params.success) {
            return res.status(400).json({
                error: "Could not parse params"
            })
        }
        try {
            const mediaFile = await this._mediaFileUseCase.get(params.data.id)
            if (mediaFile === null) {
                return res.status(404).json({
                    error: "No media file found"
                })
            }
            return res.status(200).json(mediaFile.toJSON())
        } catch (err) {
            return res.status(500).json({
                error: "Error getting media files"
            })
        }
    }

    async getAll(_: Request, res: Response): Promise<any> {
        try {
            const mediaFiles = await this._mediaFileUseCase.getAll()
            return res.status(200).json(mediaFiles.map((mf) => mf.toJSON()))
        } catch (err) {
            return res.status(500).json({
                error: "Error getting media files"
            })
        }
    }
}
