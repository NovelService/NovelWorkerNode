import { SQSClient, ReceiveMessageCommand, DeleteMessageCommand } from "@aws-sdk/client-sqs";

import _messageHandler from './messageHandler.js';
import fileHandler from './fileHandler.js'

async function start(config, messageHandler = _messageHandler) {
    const client = new SQSClient(
        {
            region: config.aws.region,
            credentials: config.aws.credentials
        });
    const command = new ReceiveMessageCommand(
        {
            QueueUrl: config.aws.sqs.queueUrl,
            MaxNumberOfMessages: 1,
            WaitTimeSeconds: 20
        }
    );


    while (true) {
        try {
            const response = await client.send(command);
            if (typeof response.Messages !== 'undefined') {
                await messageHandler.handleMessage(response.Messages[0].Body);
                await fileHandler.saveFile(config, "todo")
                await deleteMessage(config, response.Messages[0].ReceiptHandle)
            }
        } catch (error) {
            console.warn(error);
        }
    }
}

async function deleteMessage(config, receiptHandle) {
    const client = new SQSClient(
        {
            region: config.aws.region,
            credentials: config.aws.credentials
        });
    const command = new DeleteMessageCommand({
        QueueUrl: config.aws.sqs.queueUrl,
        ReceiptHandle: receiptHandle
    });

    await client.send(command)
}

export default { start };