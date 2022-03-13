import messageListener from './messageListener.js';

console.log("start")

const config = readConfig();

messageListener.start(config);

function readConfig() {
    // TODO verify non-empty values
    let config = {
        aws: {
            credentials: {
                accessKeyId: process.env.ACCESS_KEY_ID,
                secretAccessKey: process.env.SECRET_ACCESS_KEY,
            },
            region: process.env.REGION,
            sqs: {
                queueUrl: process.env.QUEUE_URL
            },
            s3: {
                bucket: process.env.BUCKET
            }
        }
    };

    return config;
}