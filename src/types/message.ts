export interface Message {
    id: string,
    urls: string[],
    options: Options
}

interface Options {
    output: string
}