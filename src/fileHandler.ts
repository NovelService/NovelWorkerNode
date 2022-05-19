import { PutObjectCommand } from '@aws-sdk/client-s3'
import { HttpRequest } from '@aws-sdk/protocol-http'
import { parseUrl } from '@aws-sdk/url-parser'
import { formatUrl } from '@aws-sdk/util-format-url'
import { readFileSync } from 'fs'
import path from 'path'
import { Context } from './types/context.js'

const oneDay = 86400

async function saveFile(context: Context, filepath: string, filename: string) {
    const body = readFileSync(path.join(filepath, filename))
    const command = new PutObjectCommand(
        {
            Bucket: context.config.aws.s3.bucket,
            Key: filename,
            Body: body
        })

    const response = await context.clients.s3.send(command)
    console.log(response)
}


async function createPresignedUrl(context: Context, filename: string): Promise<string> {
    // From https://aws.amazon.com/blogs/developer/generate-presigned-url-modular-aws-sdk-javascript
    const host = context.config.aws.host ?? 'amazonaws.com'
    const unsignedUrl = parseUrl(`https://${context.config.aws.s3.bucket}.s3.${context.config.aws.region}.${host}/${filename}`)
    const signedUrl = await context.clients.s3Presigner.presign(new HttpRequest(unsignedUrl), {expiresIn: oneDay})
    return formatUrl(signedUrl)
}

export default {saveFile, createPresignedUrl}