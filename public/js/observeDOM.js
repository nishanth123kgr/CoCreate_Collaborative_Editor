import { editor } from "./initializeEditor";
import { addHandler, removeHandler, updateHandler } from "./domHandler";

let observer = new MutationObserver(function (mutations) {
    for (let mutation of mutations) {
        if (mutation.type === 'childList') {
            if (mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(node => {
                    addHandler(node);
                });
            }

            // Check if nodes were removed
            if (mutation.removedNodes.length > 0) {
                mutation.removedNodes.forEach(node => {
                    removeHandler(node);
                });
            }
        }
        else if (mutation.type === 'attributes') {
            // console.log('The ' + mutation.attributeName + ' attribute was modified.');
        }
        else if (mutation.type === 'characterData') {
            updateHandler(mutation.target.parentNode);
        }
    }
});

export function observeDOM() {
    observer.observe(editor.getBody(), {
        attributes: true,
        childList: true,
        subtree: true,
        characterData: true
    })
};

export function disconnectDOM() {
    observer.disconnect();
};
