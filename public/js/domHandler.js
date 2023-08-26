import { findTopParent, getIndexFromDoc, getJSON } from "./utils"
import * as Automerge from "@automerge/automerge"
import { editor } from "./initializeEditor"
import { generateIDS } from "./generateIDS"
import { socketSend, socketReceive } from "./socketHandlers"
import { firebaseConfig } from "./fbConfig"
import { initializeApp } from "firebase/app"
import { getDatabase, ref, child, get, set } from "firebase/database";

let doc = Automerge.init()
let docId = window.location.href.split('/').pop();
console.log(docId);
const app = initializeApp(firebaseConfig);
const dbRef = ref(getDatabase());
export function loadDoc() {
    get(child(dbRef, `documents/${docId}`)).then((snapshot) => {
        if (!snapshot.exists()) {
            console.log("Document being Created");
            set(child(dbRef, `documents/${docId}`), {
                doc: Automerge.save(Automerge.init())
            });
            
        } else {
            let newdoc = Automerge.load(snapshot.val().doc);
            console.log("Document Loaded");
            updateDoc(newdoc)
        }
    }).catch((error) => {
        console.error(error);
    });
}




socketReceive()

export function updateDoc(newdoc) {
    doc = newdoc
    console.log(doc);
    console.log(Automerge.getActorId(doc));
    // socketSend(doc)    
}

export function addHandler(node) {
    generateIDS(node);
    if (node.tagName !== 'SPAN' && !node.id.startsWith('mceResizeHandle') && node !== "") {
        let newdoc = Automerge.change(doc, (doc) => {
            if (!doc.body) doc.body = [];
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
                        doc.body.push(addedNode);
                    } else {
                        let nodeIndex = getIndexFromDoc(topParent.previousSibling, doc);
                        console.log(topParent.previousSibling, nodeIndex, getIndexFromDoc(topParent, doc));
                        if (getIndexFromDoc(topParent, doc) === -1 && addedNode.id && addedNode.id !== "sel-mce_0" && nodeIndex !== -1) {
                            doc.body.insertAt(nodeIndex + 1, addedNode);

                        }
                    }
                }
            }

        });
        updateDoc(newdoc)
    }
}


export function removeHandler(node) {
    generateIDS(node);
    if (node.tagName !== 'BR' && node.tagName !== 'SPAN' && !node.id.startsWith('mceResizeHandle')) {
        let delIndex = getIndexFromDoc(node, doc);
        console.log(delIndex);
        let newdoc = Automerge.change(doc, (doc) => {
            if (delIndex !== -1) {
                doc.body.deleteAt(delIndex);
            }
        }
        );
        updateDoc(newdoc)
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
                let newdoc = Automerge.change(doc, (doc) => {
                    if (nodeIndex !== -1) {
                        doc.body[nodeIndex] = getJSON(node)
                    }
                });
                updateDoc(newdoc)

            }

        }

}

export { doc }