import { unified } from 'unified';
import rehypeParse from 'rehype-parse';
import { toHtml } from 'hast-util-to-html';

export function htmlToJSON(html) {
  return unified()
    .use(rehypeParse, { fragment: true })
    .parse(html);
}

export function jsonToHTML(json) {
  return toHtml(json);
}