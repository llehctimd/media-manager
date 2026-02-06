import type { Scan } from "../model/scan.js"

export interface IScanRepository {
    get(id: string): Promise<Scan> 
    insert(scan: Scan): Promise<Scan>
    update(scan: Scan): Promise<void>
}

export class MapScanRepository implements IScanRepository {
    private _scanMap: Map<string, Scan>

    constructor() {
        this._scanMap = new Map()
    }

    async get(id: string): Promise<Scan> {
        const scan = this._scanMap.get(id)
        if (scan == null) {
            throw new Error(`No scan with id '${id}' exists in repository`)
        }
        return scan
    }

    async insert(scan: Scan): Promise<Scan> {
        if (this._scanMap.has(scan.id)) {
            throw new Error(`Scan with id '${scan.id} already exists in repository`)
        }
        this._scanMap.set(scan.id, scan)
        return scan
    }

    async update(scan: Scan): Promise<void> {
        if (!this._scanMap.has(scan.id)) {
            throw new Error(`No scan with id '${scan.id}' exists in repository`)
        }
        this._scanMap.set(scan.id, scan)
    }
}