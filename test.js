

const html = '<p>Hello <b>world</b></p>';
const json = htmlToJSON(html);

console.log(JSON.stringify(json, null, 2));

console.log("\n\n");

console.log(jsonToHTML(json));


