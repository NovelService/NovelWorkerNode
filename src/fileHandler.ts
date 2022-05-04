import { Context } from "./types/context.js";
import { HttpRequest } from "@aws-sdk/protocol-http";
import { parseUrl } from "@aws-sdk/url-parser";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { formatUrl } from "@aws-sdk/util-format-url";
import { readFileSync } from 'fs'

async function saveFile(context: Context, filename: string) {
    const body = readFileSync("./" + filename);
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
    // From https://aws.amazon.com/blogs/developer/generate-presigned-url-modular-aws-sdk-javascript/
    const unsignedUrl = parseUrl(`https://${context.config.aws.s3.bucket}.s3.${context.config.aws.region}.amazonaws.com/${filename}`);
    const signedUrl =  await context.clients.s3Presigner.presign(new HttpRequest(unsignedUrl));
    return formatUrl(signedUrl);
}

export default { saveFile, createPresignedUrl };