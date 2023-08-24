import { initializeEditor, editor, tiny} from './initializeEditor'
import { observeDOM, disconnectDOM } from './observeDOM'
import * as Y from 'yjs';


initializeEditor() // tinymce.init()


editor.on('init', () => {
    observeDOM() // Observer for tinymce changes
    editor.setContent('<p id="3f9j4k3">Initial content</p>')
})

