import { initializeEditor, editor, tiny} from './initializeEditor'
import { observeDOM, disconnectDOM } from './observeDOM'
import * as Automerge from '@automerge/automerge';
import { loadDoc } from './domHandler';


initializeEditor() // tinymce.init()


editor.on('init', () => {
    loadDoc() // Load document from firebase
    observeDOM() // Observer for tinymce changes
    editor.setContent('<p id="2f4dfd4ds">Start typing here...</p>') // Set initial content
})

