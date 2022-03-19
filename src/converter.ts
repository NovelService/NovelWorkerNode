import { epub, PercollateOptions } from "percollate"

function toEpub(urls: string[], options: PercollateOptions) {
    return epub(urls, options)
        .then(() => console.log("finished converting epub"))
        .catch(error => console.warn(error));
}

export default { toEpub };