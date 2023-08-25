export function findTopParent(node) {
    if (node) {
        if (node.parentNode.nodeName === 'BODY')
            return node;
        else
            return findTopParent(node.parentNode);
    }
}

export function getIndexFromDoc(node, doc) {
    try {
        return doc.body.findIndex((element) => element.id === node.id)
    } catch (error) {
        return -1
    }
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