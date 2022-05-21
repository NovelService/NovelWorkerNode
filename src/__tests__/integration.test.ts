import {
    DynamoDBClient,
    GetItemCommand,
    PutItemCommand
} from '@aws-sdk/client-dynamodb'
import { S3Client } from '@aws-sdk/client-s3'
import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs'
import { unmarshall } from '@aws-sdk/util-dynamodb'
import { randomUUID } from 'crypto'
import * as fs from 'fs'
import * as http from 'http'
import * as https from 'https'
import os from 'os'
import path from 'path'
import { Message } from '../types/message'

describe('Integration tests', () => {

    let dynamoDBClient: DynamoDBClient
    let s3Client: S3Client
    let sqsClient: SQSClient
    const id = randomUUID()
    const region = 'us-east-1'
    const credentials = {accessKeyId: 'some', secretAccessKey: 'thing'}
    const endpoint = 'http://localhost:4566'
    const queueUrl = `${endpoint}/000000000000/queue`
    const tableName = 'table'

    beforeEach(async () => {
        dynamoDBClient = new DynamoDBClient({
            region: region,
            credentials: credentials,
            endpoint: endpoint
        })
        s3Client = new S3Client({
            region: region,
            credentials: credentials,
            endpoint: endpoint,
            forcePathStyle: true
        })
        sqsClient = new SQSClient({
            region: region,
            credentials: credentials,
            endpoint: endpoint
        })

        const putItemCommand = new PutItemCommand({
            TableName: tableName,
            Item: {
                'id': {S: id},
                'status': {S: 'queued'}
            },
        })
        await dynamoDBClient.send(putItemCommand)
    })

    test('Calls percollate with correct values', async () => {
        // given
        const message: Message = {
            id: id,
            urls: ['https://novelservice.github.io/'],
            options: {
                output: 'to-be-removed'
            }
        }
        const sendMessageCommand = new SendMessageCommand({
            QueueUrl: queueUrl,
            MessageBody: JSON.stringify(message)
        })

        // when
        const sqsResponse = await sqsClient.send(sendMessageCommand)

        // then
        console.log(sqsResponse)
        const getItemCommand = new GetItemCommand({
            TableName: tableName,
            Key: {'id': {S: id}}
        })
        let isDone = false
        while (!isDone) {
            const {Item} = await dynamoDBClient.send(getItemCommand)
            const itemObject = unmarshall(Item)
            console.log(itemObject)
            if (itemObject.status === 'done') {
                isDone = true
                expect(itemObject.url).not.toBeUndefined()
                const novel = fs.createWriteStream(path.join(os.tmpdir(), randomUUID() + '.epub'))
                const request = https.get(itemObject.url, res => {
                    res.pipe(novel)
                    novel.on('finish', () => {
                        novel.close()
                    })
                })
            }
            await new Promise((r) => setTimeout(r, 1000))
        }
    }, 10000)

})
