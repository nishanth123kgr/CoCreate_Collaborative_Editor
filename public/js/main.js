
import ReconnectingWebSocket from 'reconnecting-websocket';

import Editor from './Editor';
import sharedb from 'sharedb/lib/client';
import json0 from 'ot-json0';
import { Duplex } from 'stream';

sharedb.types.register(json0.type);

// Connect to server via Socket.IO
const socket = new ReconnectingWebSocket(`ws://${location.host}`);
const connection = new sharedb.Connection(socket);

const docId = location.pathname.split('/')[2];
const doc = connection.get('documents', docId);
// doc.subscribe((err) => {
//   if (err) return console.error(err);
//   console.log('[Client] Document ready');
//   // initialize editor
// });

// // Log connection state
// socket.on('connect', () => {
//     console.log('[Client] Socket.IO connected:', socket.id);
// });
// socket.on('disconnect', () => {
//     console.warn('[Client] Socket.IO disconnected');
// });

// // Create ShareDB-compatible stream from Socket.IO
// function createSocketStream(socket) {
//     const stream = new Duplex({ objectMode: true });

//     stream._write = (chunk, _, cb) => {
//         socket.emit('ot-message', chunk);
//         cb();
//     };

//     socket.on('ot-message', (msg) => {
//         console.log('[Client] Received ot-message:', msg); // 🔥 You must see this
//         stream.push(msg); // 🔑 Without this, ShareDB won't get the init msg
//     });

//     socket.on('disconnect', () => {
//         console.warn('[Client] Socket.IO disconnected');
//         stream.push(null);         // <– CRUCIAL for clean shutdown
//         stream.emit('close');      // optional but good practice
//     });

//     stream._read = () => { };

//     return stream;
// }

// // Setup ShareDB connection
// const connection = new sharedb.Connection(createSocketStream(socket));

// // Get docId from URL path
// const docId = location.pathname.split('/')[2];
// console.log('[Client] Document ID:', docId);

// // Get ShareDB document
// const doc = connection.get('documents', docId);

// doc.subscribe((err) => {
//   console.log('[Client] subscribe() triggered');
//   if (err) console.error(err);
// });


// Subscribe to document and initialize editor
doc.subscribe(async (err) => {
    console.log('[Client] Subscribing to document...');

    if (err) {
        console.error('[Client] doc.subscribe error:', err);
        return;
    }

    console.log('[Client] Document subscribed:', docId);

    // Create empty doc if it doesn't exist
    if (!doc.type) {
        try {
            console.log('[Client] Creating document...');
            await doc.create({}, 'json0');
            console.log('[Client] Document created.');
        } catch (e) {
            console.error('[Client] Document creation failed:', e);
            return;
        }
    }

    const editor = new Editor(doc.data || {});
    await editor.initializeEditor();
    console.log('[Client] Editor initialized.');

    // Listen to user changes and send OT patch
    ['change', 'input', 'undo', 'redo', 'ExecCommand', 'NodeChange'].forEach(evt => {
        editor.on(evt, () => {
            const patch = editor.getPatch();
            if (patch.length > 0) {
                // if (!isPatchSafe(patch)) {
                //     console.warn('[Client] Unsafe patch detected, not submitting:', patch); 
                //     return;
                // }
                console.log('[Client] Submitting patch:', patch);
                doc.submitOp(patch, { source: true });
            }
        });
    });

    // Apply remote changes from other users
    doc.on('op', (op, source) => {
        if (!source) {
            console.log('[Client] Applying remote op:', op);
            editor.applyPatch(op);
        }
    });
});

function isPatchSafe(patch) {
    return true;
  if (!Array.isArray(patch)) return false;

  for (const op of patch) {
    if (typeof op !== 'object' || !Array.isArray(op.p)) return false;

    // Basic structure check
    if (!('oi' in op) && !('od' in op)) return false;

    // 🚫 Disallow removing entire root or children arrays
    if (JSON.stringify(op.p) === '["children"]' && 'od' in op && !('oi' in op)) return false;

    // 🚫 Disallow insertion of suspicious tags (like unexpected <script> or fake nodes)
    if (typeof op.oi === 'object' && op.oi.tagName) {
      const suspiciousTags = ['script', 'iframe', 'object', 'embed', 'style'];
      if (suspiciousTags.includes(op.oi.tagName.toLowerCase())) {
        console.warn('[Validator] Suspicious tag:', op.oi.tagName);
        return false;
      }
    }

    // 🚫 Disallow value changes that aren't strings (e.g., functions, numbers in unexpected places)
    if (op.p.includes('value') && typeof op.oi !== 'string') {
      console.warn('[Validator] Non-string value patch:', op.oi);
      return false;
    }

    // 🚫 Disallow changes to position metadata (optional)
    if (op.p.includes('position')) {
      return false; // Comment this line if you allow position metadata patching
    }
  }

  return true;
}



// doc.subscribe((err) => {
//   console.log('[Client] subscribe() callback triggered');
//   if (err) {
//     console.error('[Client] doc.subscribe error:', err);
//     return;
//   }

//   console.log('[Client] Document subscribed:', docId);

//   (async () => {
//     try {
//       if (!doc.type) {
//         console.log('[Client] Creating new doc...');
//         await doc.create({}, 'json0');
//         console.log('[Client] Document created.');
//       }

//       console.log('[Client] Initializing editor...');
//       const editor = new Editor(doc.data || {});
//       await editor.initializeEditor();
//       console.log('[Client] Editor initialized');

//       ['change', 'input', 'undo', 'redo'].forEach(evt => {
//         editor.on(evt, () => {
//           const patch = editor.getPatch();
//           if (patch.length > 0) {
//             console.log('[Client] Submitting patch:', patch);
//             doc.submitOp(patch, { source: true });
//           }
//         });
//       });

//       doc.on('op', (op, source) => {
//         if (!source) {
//           console.log('[Client] Applying remote op:', op);
//           editor.applyPatch(op);
//         }
//       });
//     } catch (e) {
//       console.error('[Client] Error during document init/editor setup:', e);
//     }
//   })();
// });
