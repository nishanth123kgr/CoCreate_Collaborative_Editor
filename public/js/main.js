import { initializeEditor, editor, tiny} from './initializeEditor'
import { observeDOM, disconnectDOM } from './observeDOM'
import * as Automerge from '@automerge/automerge';


initializeEditor() // tinymce.init()


editor.on('init', () => {
    observeDOM() // Observer for tinymce changes
    editor.setContent('<p id="2f4dfd4ds">Start typing here...</p>') // Set initial content
})

