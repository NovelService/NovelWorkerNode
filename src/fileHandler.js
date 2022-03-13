import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from 'fs'

async function saveFile(config, filePath) {

    const client = new S3Client(
        {
            region: config.aws.region,
            credentials: config.aws.credentials,

        }
    );

    const body = fs.readFileSync("./a.epub");
    const command = new PutObjectCommand(
        {
            Bucket: config.aws.s3.bucket,
            Key: "novelworker",
            Body: body
        })

    const response = await client.send(command)
    console.log(response)
}

export default { saveFile };