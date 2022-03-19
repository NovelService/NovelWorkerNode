import { PutObjectCommand } from "@aws-sdk/client-s3";
import fs from 'fs'

async function saveFile(context, filePath) {
    const body = fs.readFileSync("./a.epub");
    const command = new PutObjectCommand(
        {
            Bucket: context.config.aws.s3.bucket,
            Key: "novelworker",
            Body: body
        })

    const response = await context.clients.s3.send(command)
    console.log(response)
}

export default { saveFile };