export interface Message {
    id: string,
    urls: string[],
    options: Options
}

export interface Options {
    fileType: FileType,
    output: string
}

export enum FileType {
    PDF = "pdf",
    EPUB = "epub"
}
