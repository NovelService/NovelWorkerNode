import messageListener from './messageListener.js';

console.log("start")

const config = readConfig();

messageListener.start(config);

function readConfig() {
    let config = {
        credentials: {}
    };
    config.credentials.accessKeyId = process.env.ACCESS_KEY_ID;
    config.credentials.secretAccessKey = process.env.SECRET_ACCESS_KEY;
    config.region = process.env.REGION
    config.queueUrl = process.env.QUEUE_URL

    return config;
}