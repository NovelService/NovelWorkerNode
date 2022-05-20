import * as fs from 'fs'
import os from 'os'
import path from 'path'
import { epub, PercollateOptions } from 'percollate'

const workDir = path.join(os.tmpdir(), 'novelservice')
if (!fs.existsSync(workDir)) {
    fs.mkdirSync(workDir)
}

export class Converter {
    async toEpub(id: string, urls: string[], epubFunction = epub) {
        let filename = `${id}.epub`
        const options: PercollateOptions = {
            output: path.join(workDir, filename),
            wait: 2
        }

        await epubFunction(urls, options)
        console.log(`finished converting epub. id ${id}`)
        return {filepath: workDir, filename: filename}
    }
}