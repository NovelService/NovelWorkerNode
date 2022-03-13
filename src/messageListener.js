import { SQSClient, ReceiveMessageCommand } from "@aws-sdk/client-sqs";

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
            }
        } catch (error) {
            console.warn(error);
        }
    }
}

export default { start };