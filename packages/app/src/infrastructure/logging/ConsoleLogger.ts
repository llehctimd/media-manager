import type { Logger } from "@/infrastructure/logging/Logger.js"

export class ConsoleLogger implements Logger {
    info(message: string): void {
        console.log(this.logString(message, "info", new Date()))
    }

    debug(message: string): void {
        console.log(this.logString(message, "debug", new Date()))
    }

    warn(message: string): void {
        console.log(this.logString(message, "warn", new Date()))
    }

    error(message: string): void {
        console.error(this.logString(message, "error", new Date()))
    }

    private logString(message: string, type: string, time: Date): string {
        return `[${time.toLocaleTimeString()}] [${type.toUpperCase()}] ${message}`
    }
}
