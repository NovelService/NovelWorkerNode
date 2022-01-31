import stomp from 'stompit';
import { epub } from 'percollate';

console.log("start")

stomp.connect({ host: 'amq' }, (err, client) => {
    console.log(err);
    client.subscribe({ destination: 'stomp' }, (err, msg) => {
        msg.readString('UTF-8', (err, body) => {
            let parameters = JSON.parse(body);
            epub(urls, options)
        })
    })
})
