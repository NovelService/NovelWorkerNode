import { epub } from 'percollate';

function toEpub(urls, options) {
    epub(urls, options).then(r => console.log("finished converting epub"));
}


export default {toEpub};