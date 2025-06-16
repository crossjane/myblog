import "./styles.css";
import "highlight.js/styles/github.css";

import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import { EditorContent, ReactNodeViewRenderer, useEditor } from "@tiptap/react";
import css from "highlight.js/lib/languages/css";
import js from "highlight.js/lib/languages/javascript";
import ts from "highlight.js/lib/languages/typescript";
import html from "highlight.js/lib/languages/xml";
// load all languages with "all" or common languages with "common"
import { all, createLowlight } from "lowlight";
import ListItem from "@tiptap/extension-list-item";
import StarterKit from "@tiptap/starter-kit";

import React from "react";

// eslint-disable-next-line
import CodeBlockComponent from "./CodeBlockComponent";
import Color from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";

// create a lowlight instance
const lowlight = createLowlight(all);

// you can also register individual languages
lowlight.register("html", html);
lowlight.register("css", css);
lowlight.register("js", js);
lowlight.register("ts", ts);

export const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }
  const editStlye = "p-2 cursor-pointer";

  return (
    <div className="control-group">
      <div className="button-group">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={`${editor.isActive("bold") ? "is-active" : ""} ${editStlye}`}
        >
          <img
            src="/public/textEditor_bold.svg"
            alt="Bold"
            className="w-6 h-auto"
          />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={`${editor.isActive("italic") ? "is-active" : ""} ${editStlye}`}
        >
          <img
            src="/public/textEditor_italic.svg"
            alt="italic"
            className="w-6 h-auto"
          />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={`${editor.isActive("strike") ? "is-active" : ""} ${editStlye}`}
        >
          <img
            src="/public/textEditor_strike.svg"
            alt="strike"
            className="w-6 h-auto"
          />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`${editor.isActive("bulletList") ? "is-active" : ""} ${editStlye}`}
        >
          <img
            src="/public/textEditor_bulletList.svg"
            alt="bulletList"
            className="w-6 h-auto"
          />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`${editor.isActive("blockquote") ? "is-active" : ""} ${editStlye}`}
        >
          {" "}
          <img
            src="/public/textEditor_quote.svg"
            alt="quote"
            className="w-6 h-auto"
          />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`${editor.isActive("codeBlock") ? "is-active" : ""} ${editStlye}`}
        >
          <img
            src="/public/textEditor_codeBlock.svg"
            alt="codeBlock"
            className="w-6 h-auto"
          />
        </button>
        <button
          onClick={() => editor.chain().focus().setColor("#DC2626").run()}
          className={`${editor.isActive("textStyle", { color: "#DC2626" }) ? "is-active" : ""} ${editStlye}`}
        >
          <img src="/public/color_red.svg" alt="red" className="w-6 h-auto" />
        </button>
        <button
          onClick={() => editor.chain().focus().setColor("#965AFD").run()}
          className={`${editor.isActive("textStyle", { color: "#965AFD" }) ? "is-active" : ""} ${editStlye}`}
        >
          <img
            src="/public/color_purple.svg"
            alt="red"
            className="w-6 h-auto"
          />
        </button>
        <button
          onClick={() => editor.chain().focus().setColor("#1E40AF").run()}
          className={`${editor.isActive("textStyle", { color: "#1E40AF" }) ? "is-active" : ""} ${editStlye}`}
        >
          <img src="/public/color_blue.svg" alt="red" className="w-6 h-auto" />
        </button>
        <button
          onClick={() => editor.chain().focus().setColor("#047857").run()}
          className={`${editor.isActive("textStyle", { color: "#047857" }) ? "is-active" : ""} ${editStlye}`}
        >
          <img src="/public/color_green.svg" alt="red" className="w-6 h-auto" />
        </button>
        <button
          onClick={() => editor.chain().focus().setColor("#4B5320").run()}
          className={`${editor.isActive("textStyle", { color: "#4B5320" }) ? "is-active" : ""} ${editStlye}`}
        >
          <img
            src="/public/color_olivegreen.svg"
            alt="red"
            className="w-6 h-auto"
          />
        </button>
        <button
          onClick={() => editor.chain().focus().setColor("#999999").run()}
          className={`${editor.isActive("textStyle", { color: "#999999" }) ? "is-active" : ""} ${editStlye}`}
        >
          <img src="/public/color_red.svg" alt="red" className="w-6 h-auto" />
        </button>
        <button
          onClick={() => editor.chain().focus().setColor("#64748B").run()}
          className={`${editor.isActive("textStyle", { color: "#64748B" }) ? "is-active" : ""} ${editStlye}`}
        >
          <img src="/public/color_red.svg" alt="red" className="w-6 h-auto" />
        </button>
        <button
          onClick={() => editor.chain().focus().setColor("#2E2E2E").run()}
          className={`${editor.isActive("textStyle", { color: "##2E2E2E" }) ? "is-active" : ""} ${editStlye}`}
        >
          <img src="/public/color_red.svg" alt="red" className="w-6 h-auto" />
        </button>
      </div>
    </div>
  );
};

export const Editor = ({ onChangeContent }) => {
  const editor = useEditor({
    extensions: [
      Color.configure({ types: [TextStyle.name, ListItem.name] }),
      TextStyle.configure({ types: [ListItem.name] }),
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
        },
      }),
      Document,
      Paragraph,
      Text,
      CodeBlockLowlight.extend({
        addNodeView() {
          return ReactNodeViewRenderer(CodeBlockComponent);
        },
      }).configure({ lowlight }),
    ],
    content: "<p>내용을 입력해주세요<p>",
    onUpdate: () => {
      const html = editor.getHTML();
      onChangeContent(html);
    },
  });

  return (
    <>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </>
  );
};
