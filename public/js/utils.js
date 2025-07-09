import { unified } from 'unified';
import rehypeParse from 'rehype-parse';
import { toHtml } from 'hast-util-to-html';
import { apply } from "ot-json0/lib/json0";


export function htmlToJSON(html) {
  return unified()
    .use(rehypeParse, { fragment: true })
    .parse(html);
}

export function jsonToHTML(json) {
  return toHtml(json);
}

export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}


export function safeApplyPatch(json, patch) {
  try {
    const clone = deepClone(json);
    apply(clone, patch); // simulate patching
    return clone;
  } catch (err) {
    console.warn('[Validator] Patch application failed:', err);
    return null;
  }
}

export function isSafePatch(currentJSON, patch) {
  const simulated = safeApplyPatch(currentJSON, patch);
  return simulated && isValidDOMTree(simulated);
}



export function isValidDOMTree(node) {
  function walk(current, parent) {
    if (typeof parent === 'string' && current?.type === 'element') return false;

    if (Array.isArray(current)) {
      return current.every(child => walk(child, current));
    }

    if (typeof current === 'object' && current !== null) {
      // Validate text nodes
      if (current.type === 'text') {
        if (typeof current.value !== 'string') return false;
      }

      // Validate element nodes
      if (current.type === 'element') {
        if (typeof current.tagName !== 'string') return false;
      }

      if (Array.isArray(current.children)) {
        for (const child of current.children) {
          if (!walk(child, current)) return false;
        }
      }

      for (const key in current) {
        if (key !== 'children' && !walk(current[key], current)) return false;
      }
    }

    return true;
  }

  return walk(node, null);
}


