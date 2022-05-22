export interface Message {
    id: string,
    urls: string[],
    options: Options
}

export interface Options {
    output: string
}
