import type { Scan } from "@/domain/scans/Scan.js"

export interface ScanRepository {
    findById(id: string): Promise<Scan | null>
    save(scan: Scan): Promise<void>
}
