import { findTopParent, getIndexFromDoc, getJSON } from "./utils";
import * as Automerge from "@automerge/automerge";
import { editor } from "./initializeEditor";
import { generateIDS } from "./generateIDS";

let doc = Automerge.init()



function updateDoc(newdoc) {
    doc = newdoc;
    console.log(Automerge.getLastLocalChange(doc));
}

export function addHandler(node) {
    generateIDS(node);
    if (node.tagName !== 'SPAN' && node.id.slice(0, -2) !== 'mceResizeHandle') {
        let newdoc = Automerge.change(doc, (doc) => {
            if (!doc.body) doc.body = []
            console.log(node.nodeName !== '#text' ? node.nodeName : node)
            if (!node.parentNode) node = editor.selection.getNode()
            console.log(node)
            if (node.parentNode.nodeName === 'BODY') {
                let topParent = findTopParent(node)
                console.log(topParent.previousSibling);
                if (topParent.previousSibling) {
                    let addedNode = getJSON(topParent)
                    let nodeIndex = getIndexFromDoc(topParent.previousSibling, doc) + 1
                    if(getIndexFromDoc(topParent, doc) === -1 && addedNode.id && addedNode.id !== "sel-mce_0")
                    doc.body.insertAt(nodeIndex, addedNode)
                } else {
                    doc.body.push(addedNode)
                }
            }
        })
        updateDoc(newdoc);
        console.log(doc.body);
    }
}

export function removeHandler(node) {
    generateIDS(node);
    if(node)
    if (node.tagName !== 'BR' || node.tagName !== 'SPAN' || node.id.slice(0, -2) !== 'mceResizeHandle') {
        let delIndex = getIndexFromDoc(node, doc);
        let newdoc = Automerge.change(doc, (doc) => {
            if (!doc.body) doc.body = []
            if (doc.body[delIndex])
                doc.body.deleteAt(getIndexFromDoc(node, doc))
        })
        updateDoc(newdoc);
        console.log(doc.body);
    }
}

export function updateHandler(node) {
    if (node)
        if (node.tagName !== 'BR' || node.tagName !== 'SPAN' || node.id.slice(0, -2) !== 'mceResizeHandle') {
            let newdoc = Automerge.change(doc, (doc) => {
                if (!doc.body) doc.body = []
                if (node.parentNode) {
                    node = findTopParent(node)
                    console.log(node);
                    let nodeIndex = getIndexFromDoc(node, doc)
                    doc.body[nodeIndex] = getJSON(node)
                }
            })
            updateDoc(newdoc);
            console.log(doc.body);
        }
}