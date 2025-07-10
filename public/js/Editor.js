import { htmlToJSON, jsonToHTML, isValidDOMTree, isSafePatch, expandDeletions, logger, flattenPatches } from "./utils";
import { apply, normalize } from "ot-json0/lib/json0";



import optimizedDiff from "json0-ot-diff";


class Editor {
  constructor(docJSON = {}) {
    this.editor = null;
    this.tiny = null;
    this.prevJSON = docJSON;
    this.suppressChange = false;
  }

  async initializeEditor() {

    logger("Initializing TinyMCE Editor...");
    logger("Previous JSON Document:", this.prevJSON);


    this.tiny = await tinymce.init({
      height: "100vh",
      selector: "div#editor",
      plugins: [
        "advlist", "anchor", "autolink", "charmap", "code", "codesample", "fullscreen",
        "help", "image", "insertdatetime", "link", "lists", "media",
        "preview", "searchreplace", "table", "visualblocks", "accordion", "advlist", "searchreplace", "pagebreak"
      ],
      toolbar: "undo redo |" +
        "fontfamily fontsize forecolor backcolor| link image accordion |" +
        "bold italic underline strikethrough subscript superscript pagebreak |" +
        " align | outdent indent | bullist numlist |" +
        " codesample searchreplace blockquote lineheight",
      statusbar: false,
      setup: (editor) => {
        this.editor = editor;
        if (Object.keys(this.prevJSON).length > 0) {
          this.editor.on('init', () => {
            this.editor.setContent(jsonToHTML(this.prevJSON));
          });
        }

        if (!this.suppressChange) {
          this.editor.fire('user-change');
        }
      },
      content_style: `
                body {
                    background: #fff;
                }

                @media (min-width: 840px) {
                    html {
                        background: #eceef4;
                        min-height: 100%;
                        padding: 0 .5rem
                    }

                    body {
                        background-color: #fff;
                        box-shadow: 0 0 4px rgba(0, 0, 0, .15);
                        box-sizing: border-box;
                        margin: 1rem auto;
                        max-width: 820px;
                        min-height: calc(100vh - 1rem);
                        padding: 1.5rem 2.5rem 2.5rem;
                        height: 842px;
                    }
                }
             `
    })
  }

  on(event, callback) {
    this.editor.on(event === 'change' ? 'user-change' : event, callback);
  }

  getContent() {
    return this.editor.getContent();
  }

  setContent(content) {
    this.editor.setContent(content);
  }

  getEditor() {
    return this.editor;
  }

  getTiny() {
    return this.tiny;
  }

  getJSON() {
    const content = this.getContent();
    logger("Content from TinyMCE Editor:", content);



    return normalize(htmlToJSON(content));
  }

  getJSONString() {
    return JSON.stringify(this.getJSON(), null, 4);
  }

  getPrevJSON() {
    return this.prevJSON || {};
  }

  getPatch() {
    let currentJSON = this.getJSON();

    let patch = optimizedDiff(this.prevJSON, currentJSON);

    this.prevJSON = currentJSON;
    return normalize(patch);
  }

  applyPatch(patch) {
    this.suppressChange = true;
    const currentJSON = this.getJSON();

    let bookmark = null;

    if(this.editor.selection)
    {
      bookmark = this.editor.selection.getBookmark(2);
    }

    // console.log(bookmark);
    
    logger("----------------------------------------------------------------");
    logger("Starting patch application...");
    logger("Raw patch:", patch);

    patch = normalize(patch);

    logger("Normalized patch:", patch);


    const newDocument = apply(currentJSON, patch);

    logger("After applying patch:", newDocument);
    logger("After applying patch as HTML:", jsonToHTML(newDocument));

    // const selection = this.editor.selection.getRng();

    this.setContent(jsonToHTML(newDocument));

    logger("Complete patch application.");
    logger("----------------------------------------------------------------");

    // this.tiny.activeEditor.selection.moveToBookmark(bookmark);

    // this.editor.focus();

    if( bookmark && this.editor.selection) {
      this.editor.selection.moveToBookmark(bookmark);
      this.editor.selection.scrollIntoView();
      // this.editor.selection.normalize();
      this.editor.focus();
    }


    // Restore selection
    // this.tiny.selection.moveToBookmark(selection);
    this.prevJSON = newDocument;

    this.suppressChange = false;
  }


  fire(event, ...args) {
    if (this.editor) {
      this.editor.fire(event, ...args);
    } else {
      console.warn("Editor not initialized, cannot fire event:", event);
    }
  }




}

export default Editor;

