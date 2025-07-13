
import ReconnectingWebSocket from 'reconnecting-websocket';

import Editor from './Editor';
import sharedb from 'sharedb/lib/client';
import json0 from 'ot-json0';

import { logger } from './utils';
import { v4 } from 'uuid';



sharedb.types.register(json0.type);

let protocol = document.location.protocol === 'https:' ? 'wss' : 'ws';

// Connect to server via Socket.IO
const socket = new ReconnectingWebSocket(`${protocol}://${location.host}`);
const connection = new sharedb.Connection(socket);

const docId = location.pathname.split('/')[2];
const doc = connection.get('documents', docId);

const presence = connection.getPresence(docId);

presence.subscribe();






// Subscribe to document and initialize editor
doc.subscribe(async (err) => {
    logger('[Client] Subscribing to document...');

    if (err) {
        console.error('[Client] doc.subscribe error:', err);
        return;
    }

    logger('[Client] Document subscribed:', docId);

    // Create empty doc if it doesn't exist
    if (!doc.type) {
        try {
            logger('[Client] Creating document...');
            await doc.create({}, 'json0');
            logger('[Client] Document created.');
        } catch (e) {
            console.error('[Client] Document creation failed:', e);
            return;
        }
    }

    const editor = new Editor(doc.data || {});
    await editor.initializeEditor();
    logger('[Client] Editor initialized.');


    function docUpdateHandler() {
        let patch = editor.getPatch();
        logger(`[Client] Patch`, patch);
        if (!patch || patch.length === 0) {
            logger('[Client] No changes detected, skipping patch submission.');
            return;
        }
        doc.submitOp(patch, { source: 'true' }, (err) => {
            if (err) {
                console.error('[Client] Error submitting patch:', err);
            }
        });
    }


    function debounce(fn, delay) {
        let timeoutId;
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                fn.apply(this, args);
            }, delay);
        };
    }

    let suppressPresence = false;

    const debouncedDocUpdateHandler = debounce(docUpdateHandler, 10);

    const localPresence = presence.create();


    ['change', 'input', 'undo', 'redo', 'ExecCommand', 'NodeChange'].forEach(evt => {
        editor.on(evt, () => {
            if (suppressPresence) return; // 🚫 avoid recursive presence updates

            let selection = editor.getEditor().selection.getBookmark(2);

            if (selection) {
                console.log("Selection:", selection);
                localPresence.submit({ bookmark: selection, userID: editor.id, color: editor.color });
            } else {
                console.warn('Editor selection is not available.');
            }

            debouncedDocUpdateHandler();
        });
    });



    presence.on('receive', (presenceId, update) => {

        if (update === null) {
            // The remote client is no longer present in the document
            console.log(`Presence update: ${presenceId} left the document`);

        } else {
            console.log(update);
            suppressPresence = true;
            editor.editor.selection.moveToBookmark(update.bookmark);
            editor.editor.selection.scrollIntoView();
            editor.editor.focus();
            suppressPresence = false;

        }
    });




    // Apply remote changes from other users
    doc.on('op batch', (ops, source) => {


        if (!source) {
            editor.applyPatch(ops);
        }
    });
});
