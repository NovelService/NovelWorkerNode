import { SQSClient, ReceiveMessageCommand } from "@aws-sdk/client-sqs";

import _messageHandler from './messageHandler.js';

async function start(config, messageHandler = _messageHandler) {
    const client = new SQSClient({ region: config.region, credentials: config.credentials });
    const command = new ReceiveMessageCommand(
        {
            QueueUrl: config.queueUrl,
            MaxNumberOfMessages: 1,
            WaitTimeSeconds: 20
        }
    );


    while(true) {
        try {
            const response = await client.send(command);
            if (typeof response.Messages !== 'undefined') {
                messageHandler.handleMessage(response.Messages[0].Body);
            }
        } catch (error) {
            console.warn(error);
        }
    }
}

export default { start };