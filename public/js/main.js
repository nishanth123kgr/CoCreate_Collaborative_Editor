import render from 'dom-serializer';
import Editor from './Editor'
import { parse } from 'flatted';


const socket = io();


const docJSON = `[{
    "parent": null,
    "prev": null,
    "next": null,
    "startIndex": null,
    "endIndex": null,
    "children": "1",
    "type": "2"
},[
    "3"
],"root",{
    "parent": "0",
    "prev": null,
    "next": null,
    "startIndex": null,
    "endIndex": null,
    "children": "4",
    "name": "5",
    "attribs": "6",
    "type": "7"
},[
    "8"
],"p",{},"tag",{
    "parent": "3",
    "prev": null,
    "next": null,
    "startIndex": null,
    "endIndex": null,
    "data": "9",
    "type": "10"
},"ssdsdf","text"]`;


const editor = new Editor(parse(docJSON));

await editor.initializeEditor();



editor.on('change', () => {
    const domJSONContainer = document.getElementById('dom-json');

    console.log(editor.getJSONString());

    domJSONContainer.getElementsByClassName('json')[0].innerHTML = editor.getJSONString();
    domJSONContainer.getElementsByClassName('html')[0].innerHTML = render(editor.getJSON());

});

editor.on('input', () => {
    const domJSONContainer = document.getElementById('dom-json');

    // console.log(editor.getJSONString());

    domJSONContainer.getElementsByClassName('json')[0].innerHTML = editor.getJSONString();
    domJSONContainer.getElementsByClassName('html')[0].innerHTML = render(editor.getJSON());
});

socket.on('update-doc', (msg) => {
    editor.setContent(msg);
})