import { epub, PercollateOptions } from "percollate"

async function toEpub(id: string, urls: string[]) {
    const options: PercollateOptions = {
        output: `${id}.epub`,
        wait: 2
    }

    await epub(urls, options)
    console.log(`finished converting epub. id ${id}`)
    return options.output
}

export default { toEpub };