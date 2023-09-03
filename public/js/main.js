import { initializeEditor, editor, tiny} from './initializeEditor'
import * as Automerge from '@automerge/automerge'


initializeEditor()
const socket = io()

editor.on('init', () => {
    editor.setContent("<p id='e23frw23'>Start typing here...</p>")
})
 

editor.on('change', () => {
    socket.emit('doc-updated', editor.getContent())
})

editor.on('input', () => {
    socket.emit('doc-updated', editor.getContent())
})

socket.on('update-doc', (msg) => {
    editor.setContent(msg)
})