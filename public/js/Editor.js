import { parseDocument } from "htmlparser2";
import render from "dom-serializer";
import { parse, stringify } from "flatted";


class Editor {
  constructor(docJSON = {}) {
    this.editor = null;
    this.tiny = null;
    this.prevJSON = docJSON;
  }

  async initializeEditor() {

    console.log("Initializing TinyMCE Editor...");
    console.log("Previous JSON Document:", this.prevJSON);
    
    
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
      setup: (editorSpace) => {
        this.editor = editorSpace;
        editorSpace.on('init', () => {
          editorSpace.setContent(render(this.prevJSON));
        });
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
    this.editor.on(event, callback);
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
    return parseDocument(content);
  }

  getJSONString() {
    return stringify(this.getJSON(), null, 4);
  }

  getHTML() {
    const content = this.getContent();
    return content;
  }






}

export default Editor;

