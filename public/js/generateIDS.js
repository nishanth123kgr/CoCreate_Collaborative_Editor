import {v4 as uuidv4} from 'uuid';

export function generateIDS(node) {
    if (!node.id) {
        node.id = uuidv4().split('-')[0];
    }

    if (node.childNodes) {
        node.childNodes.forEach(child => {
            generateIDS(child);
        });
    }
}
