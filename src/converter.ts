import * as fs from 'fs'
import os from 'os'
import path from 'path'
import { epub, pdf, PercollateOptions } from 'percollate'

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

    async toPdf(id: string, urls: string[], pdfFunction = pdf) {
        let filename = `${id}.pdf`
        const options: PercollateOptions = {
            output: path.join(workDir, filename),
            wait: 2
        }

        await pdfFunction(urls, options)
        console.log(`finished converting pdf. id ${id}`)
        return {filepath: workDir, filename: filename}
    }
}