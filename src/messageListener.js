import stomp from 'stompit';
import converterWrapper from './converter.js';

function start(config) {
    stomp.connect({host: 'amq'}, (err, client) => {
        client.subscribe({destination: 'stomp'}, (err, message) => {
            handleMessage(message);
        })
    })
}

function handleMessage(message, converter = converterWrapper) {
    message.readString('UTF-8', (err, body) => {
        let parameters = JSON.parse(body);
        converter.toEpub(parameters.urls, parameters.options);
    })
}

export default {start};