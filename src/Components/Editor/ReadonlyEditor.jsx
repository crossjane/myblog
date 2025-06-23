import React from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Typography from "@tiptap/extension-typography";
import Highlight from "@tiptap/extension-highlight";

function ReadonlyEditor({ content }) {
  const editor = useEditor({
    extensions: [StarterKit, Highlight, Typography],
    content,
    editable: false,
  });
  if (!editor) {
    return null;
  }
  return <EditorContent editor={editor} content={content} />;
}
export default ReadonlyEditor;
