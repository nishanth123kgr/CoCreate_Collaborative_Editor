import * as Automerge from '@automerge/automerge';

const socket = io()

export function socketSend(newDoc) {
    socket.emit('doc-updated', { change: newDoc })
}

export function socketReceive(newDoc) {
    socket.on('update-doc', (msg) => {
        // const change = new Uint8Array(msg.split(','))
        // console.log(change);
        // Apply the Automerge changes to the document
        console.log(doc, msg);
        doc = Automerge.merge(doc, msg)

        console.log(doc.body);
    });
}