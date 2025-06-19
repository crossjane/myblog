import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React from "react";

function ReadonlyEditor({ content }) {

    console.log("콘텐트",content)
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    editable: false,
  });

  if (!editor) {
    return null;
  }

  return (
  <EditorContent editor={editor} />
);
}

export default ReadonlyEditor;
