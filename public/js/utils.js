import { unified } from 'unified';
import rehypeParse from 'rehype-parse';
import { toHtml } from 'hast-util-to-html';

import { diff_match_patch } from 'diff-match-patch';
import optimizedDiff from "json0-ot-diff";
// import * as text0 from "ot-text-unicode";



export function htmlToJSON(html) {
  return unified()
    .use(rehypeParse, { fragment: true })
    .parse(html);
}

export function jsonToHTML(json) {
  return toHtml(json);
}


export function logger(...messages) {
  console.log(`[Logger] [${new Date().toISOString()}]`, ...messages);
}





const dmp = new diff_match_patch();

function dmpToText0Ops(oldStr, diffs) {
  const ops = [];
  let cursor = 0;

  for (const [op, data] of diffs) {
    if (op === 0) { // Equal
      cursor += data.length;
    } else if (op === -1) { // Delete
      ops.push({ p: cursor, d: data });
    } else if (op === 1) { // Insert
      ops.push({ p: cursor, i: data });
      cursor += data.length;
    }
  }

  return ops;
}

export function hybridDiff(oldDoc, newDoc) {
  const basePatch = optimizedDiff(oldDoc, newDoc);

  const enhancedPatch = basePatch.map(op => {
    // Handle string overwrite
    const oldStr = op.od || op.ld;
    const newStr = op.oi || op.li;

    if (typeof oldStr === "string" && typeof newStr === "string") {
      const diffs = dmp.diff_main(oldStr, newStr);
      dmp.diff_cleanupEfficiency(diffs);
      const text0Ops = dmpToText0Ops(oldStr, diffs);

      if (text0Ops.length > 0) {
        return {
          p: [...op.p],
          t: "text0",
          o: text0Ops
        };
      }
    }

    return op;
  });

  return enhancedPatch;
}
