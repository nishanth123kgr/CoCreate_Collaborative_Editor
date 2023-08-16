import { findTopParent, getIndexFromDoc, getJSON } from "./utils"
import * as Y from "yjs"
import { editor } from "./initializeEditor"
import { generateIDS } from "./generateIDS"
import { socketSend, socketReceive } from "./socketHandlers"

let document = new Y.Doc()
let doc = document.getArray('body')


socketReceive()

export function updateDoc(newdoc) {
    doc = newdoc
    // console.log(Automerge.getLastLocalChange(doc));
    socketSend(doc)
}

export function addHandler(node) {
    generateIDS(node)
    if (node.tagName !== 'SPAN' && node.id.slice(0, -2) !== 'mceResizeHandle') {
        console.log(node.nodeName !== '#text' ? node.nodeName : node)
        if (!node.parentNode) node = editor.selection.getNode()
        console.log(node)
        if (node.parentNode.nodeName === 'BODY') {
            let topParent = findTopParent(node)
            let addedNode = getJSON(topParent)
            console.log(topParent.previousSibling)
            if (doc.length === 0) {
                console.log("Inside len");
                doc.push([addedNode])
                console.log(doc);
                return
            }
            if (topParent.previousSibling) {
                let nodeIndex = getIndexFromDoc(topParent.previousSibling, doc) + 1
                console.log(nodeIndex);
                if (getIndexFromDoc(topParent, doc) === -1 && addedNode.id && addedNode.id !== "sel-mce_0")
                    doc.insert(nodeIndex, [addedNode])
            } else {
                console.log('here');
                doc.push([addedNode])
                console.log(doc);
            }
        }
        console.log(doc)
    }
}

export function removeHandler(node) {
    generateIDS(node)
    // if(node)
    // if (node.tagName !== 'BR' || node.tagName !== 'SPAN' || node.id.slice(0, -2) !== 'mceResizeHandle') {
    //     let delIndex = getIndexFromDoc(node, doc)
    //     let newdoc = Automerge.change(doc, (doc) => {
    //         if (!doc.body) doc.body = []
    //         if (doc.body[delIndex])
    //             doc.body.deleteAt(getIndexFromDoc(node, doc))
    //     })
    //     updateDoc(newdoc)
    //     console.log(doc.body)
    // }
    console.log(doc);
}

export function updateHandler(node) {
    // if (node)
    //     if (node.tagName !== 'BR' || node.tagName !== 'SPAN' || node.id.slice(0, -2) !== 'mceResizeHandle') {
    //         let newdoc = Automerge.change(doc, (doc) => {
    //             if (!doc.body) doc.body = []
    //             if (node.parentNode) {
    //                 node = findTopParent(node)
    //                 console.log(node)
    //                 let nodeIndex = getIndexFromDoc(node, doc)
    //                 doc.body[nodeIndex] = getJSON(node)
    //             }
    //         })
    //         updateDoc(newdoc)
    //         console.log(doc.body)
    //     }
    console.log(doc);
}

export { doc }