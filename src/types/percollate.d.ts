
export declare function epub(urls: string[], options: PercollateOptions)
    : Promise<PercollateResult>

interface PercollateResult {
    items: object[],
    options: PercollateOptions
}

interface PercollateOptions {
    output: string
}