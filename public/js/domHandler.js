import { findTopParent, getIndexFromDoc, getJSON } from "./utils";
import * as Y from "yjs";
import { editor } from "./initializeEditor";
import { generateIDS } from "./generateIDS";
import { socketSend, socketReceive } from "./socketHandlers";

let document = new Y.Doc();
let doc = document.getArray('body');

function logUpdate(document) {
    console.log(document.toJSON());
}

socketReceive();

export function updateDoc(newdoc) {
    doc.clear();
    doc.push(newdoc);
    socketSend(doc.toJSON());
}

export function addHandler(node) {
    generateIDS(node);
    if (node.tagName !== 'SPAN' && !node.id.startsWith('mceResizeHandle') && node !== "") {
        console.log(node.nodeName !== '#text' ? node.nodeName : node.parentNode);
        if (!node.parentNode) node = editor.selection.getNode();
        if (!node.id) generateIDS(node);
        console.log(node);
        if (node.parentNode.nodeName === 'BODY') {
            let topParent = findTopParent(node);
            let addedNode = getJSON(topParent);
            console.log(topParent, topParent.previousSibling);
            if (getIndexFromDoc(topParent, doc) === -1) {
                if (!topParent.previousSibling) {
                    doc.push([addedNode]);
                } else {
                    let nodeIndex = getIndexFromDoc(topParent.previousSibling, doc);
                    console.log(topParent.previousSibling, nodeIndex, getIndexFromDoc(topParent, doc));
                    if (getIndexFromDoc(topParent, doc) === -1 && addedNode.id && addedNode.id !== "sel-mce_0" && nodeIndex !== -1) {
                        doc.insert(nodeIndex + 1, [addedNode]);

                    }
                }
            }
        }
        logUpdate(doc);
    }
}

export function removeHandler(node) {
    generateIDS(node);
    if (node.tagName !== 'BR' && node.tagName !== 'SPAN' && !node.id.startsWith('mceResizeHandle')) {
        let delIndex = getIndexFromDoc(node, doc);
        console.log(delIndex);
        if (delIndex !== -1) {
            doc.delete(delIndex);
        }
        logUpdate(doc);
    }

}

// The updateHandler function is commented out in your original code
// Uncomment and implement it based on your requirements



export function updateHandler(node) {
    if (node)
        if (node.id.slice(0, -2) !== 'mceResizeHandle' && node.tagName !== "BODY") {
            if (node.parentNode) {
                node = findTopParent(node)
                console.log(node)
                let nodeIndex = getIndexFromDoc(node, doc)
                if (nodeIndex !== -1)
                {
                    document.transact(() => {
                        doc.delete(nodeIndex);
                        doc.insert(nodeIndex, [getJSON(node)]);
                    });
                    logUpdate(doc);
                }

            }

        }
    
}

export { doc }