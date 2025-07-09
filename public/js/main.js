import Editor from './Editor'
import { parse } from 'flatted';
import { jsonToHTML } from './utils';


const socket = io();


const docJSON = `{ "type": "root", "children": [ { "type": "element", "tagName": "p", "properties": {}, "children": [ { "type": "text", "value": "fvbcvbc", "position": { "start": { "line": 1, "column": 4, "offset": 3 }, "end": { "line": 1, "column": 11, "offset": 10 } } } ], "position": { "start": { "line": 1, "column": 1, "offset": 0 }, "end": { "line": 1, "column": 15, "offset": 14 } } } ], "data": { "quirksMode": false }, "position": { "start": { "line": 1, "column": 1, "offset": 0 }, "end": { "line": 1, "column": 15, "offset": 14 } } }`;


const editor = new Editor(JSON.parse(docJSON));

await editor.initializeEditor();

const patchContainer = document.getElementById("patch");

const applyPatchBtn = patchContainer.querySelector('#apply-patch-btn');

applyPatchBtn.addEventListener('click', () => {
    const patchTextArea = patchContainer.querySelector('#patch-area');
    const patch = JSON.parse(patchTextArea.value);
    console.log("Applying Patch:", patch);
    editor.applyPatch(patch);
});

function docUpdateHandler(editor) {
    const domJSONContainer = document.getElementById('dom-json');

    console.log(editor.getJSONString());

    domJSONContainer.getElementsByClassName('json')[0].innerHTML = editor.getJSONString();
    domJSONContainer.getElementsByClassName('html')[0].innerHTML = jsonToHTML(editor.getJSON());

    let patch = editor.getPatch();

    console.log("Patch:", JSON.stringify(patch, null, 4));

    document.querySelector('#json-patch').innerHTML = JSON.stringify(patch, null, 4);
    document.querySelector('#patch-area').value = JSON.stringify(patch, null, 4);

    editor.prevJSON = editor.getJSON();
}

editor.on('change', () => docUpdateHandler(editor));

editor.on('input', () => docUpdateHandler(editor));

socket.on('update-doc', (msg) => {
    editor.setContent(msg);
})