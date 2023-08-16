export function findTopParent(node) {
    if (node) {
        if (node.parentNode.nodeName === 'BODY')
            return node;
        else
            return findTopParent(node.parentNode);
    }
}

export function getIndexFromDoc(node, doc) {
    doc.forEach((element, i) => {
            if (element.id === node.id) {
                console.log(element, i);
                return i;
            } 
    });
    return -1
}

export function getJSON(node) {
    return domJSON.toJSON(node, {
        attributes: true,
        domProperties: {
            values: ['nodeName', 'nodeType', 'textContent', 'id']
        },
        metadata: false
    });
}