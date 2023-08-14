import { generateIDS } from "./generateIDS";
import * as Automerge from "@automerge/automerge";
import { editor } from "./initializeEditor";

let doc = Automerge.init()

function getJSON(node) {
    generateIDS(node);
    return domJSON.toJSON(node, {
        attributes: true,
        domProperties: {
            values: ['nodeName', 'nodeType', 'textContent', 'id']
        },
        metadata: false
    });
}

function updateDoc(newdoc) {
    doc = newdoc;
}

function findTopParent(node) {
    if (node) {
        if (node.parentNode.nodeName === 'BODY')
            return node;
        else
            return findTopParent(node.parentNode);
    }
}

function getIndexFromDoc(node, doc) {
    return doc.body.indexOf(doc.body.find((element) => element.id === node.id))
}

export function addHandler(node) {
    let addedNode = getJSON(node)
    if (node.tagName !== 'SPAN' && node.id.slice(0, -2) !== 'mceResizeHandle') {
        let newdoc = Automerge.change(doc, (doc) => {
            if (!doc.body) doc.body = []
            console.log(node.nodeName !== '#text' ? node.nodeName : node)
            if (!node.parentNode) node = editor.selection.getNode()
            console.log(node)
            if (node.parentNode.nodeName === 'BODY') {
                let topParent = findTopParent(node)
                if (topParent.previousSibling) {
                    let nodeIndex = getIndexFromDoc(topParent.previousSibling, doc) + 1
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
    if (node.tagName !== 'BR' && node.tagName !== 'SPAN' && node.id.slice(0, -2) !== 'mceResizeHandle') {
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
        if (node.tagName !== 'BR' && node.tagName !== 'SPAN' && node.id.slice(0, -2) !== 'mceResizeHandle') {
            let newdoc = Automerge.change(doc, (doc) => {
                if (!doc.body) doc.body = []
                let nodeIndex = getIndexFromDoc(node, doc)
                doc.body[nodeIndex] = getJSON(node)
            })
            updateDoc(newdoc);
            console.log(doc.body);
        }
}