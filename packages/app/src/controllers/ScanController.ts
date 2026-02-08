import type { ScanUseCase } from "@/application/ScanUseCase.js"
import type { Logger } from "@/infrastructure/logging/Logger.js"
import type { Request, Response } from "express"
import { z } from "zod"

const queueScanBodySchema = z.object({
    path: z.string(),
})

const getScanParamsSchema = z.object({
    id: z.string(),
})

export class ScanController {
    private _scanUseCase: ScanUseCase

    constructor(scanUseCase: ScanUseCase) {
        this._scanUseCase = scanUseCase
    }

    async queueScan(req: Request, res: Response): Promise<any> {
        const body = queueScanBodySchema.safeParse(req.body)
        if (!body.success) {
            return res.status(400).json({
                error: "Could not parse body",
            })
        }
        try {
            const path = body.data.path
            const scan = await this._scanUseCase.queueScan(path)
            return res.status(201).json(scan.toJSON())
        } catch (err) {
            return res.status(400).json({
                error: "Could not start a new scan",
            })
        }
    }

    async getScan(req: Request, res: Response): Promise<any> {
        const params = getScanParamsSchema.safeParse(req.params)
        if (!params.success) {
            return res.status(400).json({
                error: "Could not parse params",
            })
        }
        try {
            const id = params.data.id
            const scan = await this._scanUseCase.getScan(id)
            if (scan === null) {
                return res.status(404).json({
                    error: "No scan found",
                })
            }
            return res.status(200).json(scan.toJSON())
        } catch (err) {
            return res.status(500).json({
                error: "Could not get scan",
            })
        }
    }
}
