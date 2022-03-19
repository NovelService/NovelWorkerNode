import { ReceiveMessageCommand, DeleteMessageCommand } from "@aws-sdk/client-sqs";

import _messageHandler from './messageHandler';
import fileHandler from './fileHandler'
import { Context } from "./types/context";

async function start(context: Context, messageHandler = _messageHandler) {
    const command = new ReceiveMessageCommand(
        {
            QueueUrl: context.config.aws.sqs.queueUrl,
            MaxNumberOfMessages: 1,
            WaitTimeSeconds: 20
        }
    );

    while (true) {
        try {
            const response = await context.clients.sqs.send(command);
            if (typeof response.Messages !== 'undefined' && typeof response.Messages[0].Body !== "undefined") {
                await messageHandler.handleMessage(response.Messages[0].Body);
                await fileHandler.saveFile(context, "todo")
                if (typeof response.Messages[0].ReceiptHandle !== "undefined"){

                    await deleteMessage(context, response.Messages[0].ReceiptHandle)
                }
            }
        } catch (error) {
            console.warn(error);
        }
    }
}

async function deleteMessage(context: Context, receiptHandle: string) {
    const command = new DeleteMessageCommand({
        QueueUrl: context.config.aws.sqs.queueUrl,
        ReceiptHandle: receiptHandle
    });

    await context.clients.sqs.send(command)
}

export default { start };