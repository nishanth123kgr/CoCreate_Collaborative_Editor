import * as Automerge from '@automerge/automerge'
import * as Y from 'yjs';

export const socket = io()

export function socketSend(newDoc) {
    socket.emit('doc-updated', newDoc)
}