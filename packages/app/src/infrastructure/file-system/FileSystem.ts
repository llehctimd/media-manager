export interface FileSystem {
    walkFiles(directory: string): AsyncIterable<string>
}
