import {epub, pdf} from 'percollate';

function toEpub(urls, options) {
    return epub(urls, options)
    .then(r => console.log("finished converting epub"))
    .catch(error => console.warn(error));
}

function toPdf(urls, options) {
    pdf(urls, options).then(r => console.log("finished converting pdf"));
}

export default {toEpub};