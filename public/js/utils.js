export function findTopParent(node) {
    if (node) {
        if (node.parentNode.nodeName === 'BODY')
            return node;
        else
            return findTopParent(node.parentNode);
    }
}

export function getIndexFromDoc(node, doc) {
    let docArray = doc.toJSON()
    return docArray.findIndex((element) => {
        return element.id === node.id
    })
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