import { epub, PercollateOptions } from "percollate"

export class Converter {
    async toEpub(id: string, urls: string[], epubFunction = epub) {
        const options: PercollateOptions = {
            output: `${id}.epub`,
            wait: 2
        }

        await epubFunction(urls, options)
        console.log(`finished converting epub. id ${id}`)
        return options.output
    }
}