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


// export function safeApplyPatch(json, patch) {
//   try {
//     const clone = deepClone(json);
//     apply(clone, patch); // simulate patching
//     return clone;
//   } catch (err) {
//     console.warn('[Validator] Patch application failed:', err);
//     return null;
//   }
// }

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

export function expandDeletions(patch, original) {
  const expanded = [];

  function recurse(path, value) {
    if (Array.isArray(value)) {
      for (let i = 0; i < value.length; i++) {
        recurse([...path, i], value[i]);
      }
    } else if (typeof value === 'object' && value !== null) {
      for (let key in value) {
        recurse([...path, key], value[key]);
      }
    } else {
      expanded.push({ p: path, od: value });
    }
  }

  for (const op of patch) {
    if ('od' in op && !('oi' in op)) {
      recurse(op.p, op.od);
    } else {
      expanded.push(op);
    }
  }

  return expanded;
}


export function applyPatchClone(originalDoc, patch) {
  const clone = structuredClone(originalDoc); // or use lodash.cloneDeep
  try {
    apply(clone, patch); // this mutates clone
    return clone;
  } catch (e) {
    console.warn("Patch application failed:", e);
    return null;
  }
}

export function isWellFormedJson(node) {
  if (typeof node !== 'object' || node === null) return true;

  if ('children' in node) {
    if (typeof node.children === 'string') return false;
    if (!Array.isArray(node.children)) return false;

    for (const child of node.children) {
      if (!isWellFormedJson(child)) return false;
    }
  }

  for (const key in node) {
    if (key !== 'children' && typeof node[key] === 'object') {
      if (!isWellFormedJson(node[key])) return false;
    }
  }

  return true;
}

export function validateAndSubmitPatch(patch, doc) {
  const expanded = expandDeletions(patch, doc);
  const simulated = applyPatchClone(doc, expanded);

  if (!simulated || !isWellFormedJson(simulated)) {
    console.warn("Rejected malformed patch:", patch);
    return; // Reject bad patch
  }

  submitPatch(expanded); // Your ShareDB submission logic
}


export function safeApplyPatch(base, patch) {
  try {
    return applyPatchClone(base, patch); // deep clone + apply
  } catch (err) {
    console.warn("Patch application failed:", err);
    return null;
  }
}


export function normalizeContentJSON(node) {
  if (Array.isArray(node)) {
    return node.map(normalizeContentJSON);
  }

  if (typeof node !== 'object' || node === null) return node;

  const normalized = { ...node };

  // Normalize tagName casing if needed (e.g., all lowercase)
  if (normalized.tagName) {
    normalized.tagName = normalized.tagName.toLowerCase();
  }

  // Normalize text content
  if (normalized.type === 'text') {
    normalized.value = normalized.value
      .replace(/\u00A0/g, ' ') // non-breaking space to space
      .replace(/\s+/g, ' ')    // multiple spaces to one
      .trim();                 // optional
  }

  // Normalize children
  if (normalized.children) {
    normalized.children = normalized.children.map(normalizeContentJSON);
  }

  // Normalize properties
  if (normalized.properties) {
    // Sort className array if present
    if (Array.isArray(normalized.properties.className)) {
      normalized.properties.className.sort();
    }

    normalized.properties = sortKeys(normalized.properties);
  }

  // Remove position metadata (optional)
  if (normalized.position) {
    delete normalized.position;
  }

  return normalized;
}


export function logger(...messages) {
  console.log(`[Logger] [${new Date().toISOString()}]`, ...messages);
}

export function flattenPatches(patch, prevJSON) {
  const grouped = new Map();

  // Group by parent array path
  for (const op of patch) {
    const p = [...op.p];
    let keyPath;

    if (typeof p[p.length - 1] === "number") {
      // This is a list op
      keyPath = JSON.stringify(p.slice(0, -1));
    } else {
      // This is a field op (e.g., "value" or "type")
      keyPath = JSON.stringify(p.slice(0, -1));
    }

    if (!grouped.has(keyPath)) grouped.set(keyPath, []);
    grouped.get(keyPath).push(op);
  }

  const compressed = [];

  for (const [key, ops] of grouped.entries()) {
    const parentPath = JSON.parse(key);

    // Check if multiple children or value-related changes
    const valueOps = ops.filter(op => op.p.at(-1) === "value");
    const listOps = ops.filter(op => typeof op.p.at(-1) === "number");

    if (valueOps.length === 1 && listOps.length === 1) {
      // Special case: split text + insert strong
      const oldJson = prevJSON;
      const oldChildren = getAtPath(oldJson, parentPath);
      if (Array.isArray(oldChildren)) {
        compressed.push({
          p: parentPath,
          od: oldChildren,
          oi: applyOpsToChildren(oldChildren, ops),
        });
      } else {
        compressed.push(...ops); // fallback
      }
    } else if (listOps.length > 0) {
      // Consolidate all list ops into one array replacement
      const oldJson = prevJSON;
      const oldList = getAtPath(oldJson, parentPath);
      compressed.push({
        p: parentPath,
        od: oldList,
        oi: applyOpsToChildren(oldList, ops),
      });
    } else {
      // Leave other ops as-is
      compressed.push(...ops);
    }
  }

  return compressed;
}

// Helper: apply ops to a list of children
function applyOpsToChildren(children = [], ops) {
  const newChildren = [...children];
  for (const op of ops) {
    const idx = op.p.at(-1);
    if (op.li !== undefined) {
      newChildren.splice(idx, 0, op.li);
    } else if (op.oi !== undefined) {
      newChildren[idx] = op.oi;
    } else if (op.ld !== undefined) {
      newChildren.splice(idx, 1);
    }
  }
  return newChildren;
}

// Helper: get nested value by path
function getAtPath(obj, path) {
  return path.reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj);
}
