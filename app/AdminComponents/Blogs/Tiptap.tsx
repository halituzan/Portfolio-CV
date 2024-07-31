import Placeholder from "@tiptap/extension-placeholder";
import "./styles.scss";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React, { useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";

export default ({ setOpen }: any) => {
  const [hideContent, setHideContent] = useState(false);
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        // Use a placeholder:
        placeholder: "Write something …",
        // Use different placeholders depending on the node type:
        // placeholder: ({ node }) => {
        //   if (node.type.name === 'heading') {
        //     return 'What’s the title?'
        //   }

        //   return 'Can you add some further context?'
        // },
      }),
    ],
    content: "",

    editorProps: {
      attributes: {
        spellcheck: "false",
        class: "min-h-[500px] bg-slate-100 border p-2 rounded",
      },
    },
  });

  return (
    <div
      className={`${hideContent ? "overflow-y-hidden" : "overflow-y-hidden"}`}
    >
      <div className='w-full my-2 z-50 block'>
        <input
          type='text'
          id='title'
          placeholder='Başlık'
          className='p-2 border rounded-sm w-full'
        />
      </div>
      <div
        className={`transition-transform duration-500 ease-in-out ${
          hideContent
            ? "transform -translate-y-full opacity-0 h-0"
            : "transform -translate-y-0 opacity-100 h-full"
        }`}
      >
        <MenuBar editor={editor} />
        <EditorContent editor={editor} />
        <div className='w-full my-2'>
          <input
            type='text'
            id='title'
            className='p-2 border rounded-sm w-full'
            placeholder='type some ticket react, nextjs, javascript etc.'
          />
        </div>
        <div className='w-full my-2 flex justify-end items-center'>
          <button
            className='p-2 bg-slate-500 rounded text-white mr-2'
            onClick={() => setOpen(false)}
          >
            İptal
          </button>
          <button className='p-2 bg-blue-600 rounded text-white'>Kaydet</button>
        </div>
      </div>
      <div className='mt-2 flex justify-center items-center py-2 w-full'>
        <Icon
          icon={
            hideContent ? "ri:arrow-down-wide-fill" : "ri:arrow-up-wide-fill"
          }
          fontSize={64}
          onClick={() => setHideContent(!hideContent)}
          className='cursor-pointer text-slate-500 hover:text-slate-900 animate-bounce'
        />
      </div>
    </div>
  );
};

const MenuBar = ({ editor }: any) => {
  if (!editor) {
    return null;
  }

  return (
    <div className='control-group bg-slate-50 mb-2'>
      <div className='button-group'>
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "is-active" : ""}
        >
          Bold
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "is-active" : ""}
        >
          Italic
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={editor.isActive("strike") ? "is-active" : ""}
        >
          Strike
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={editor.isActive("code") ? "is-active" : ""}
        >
          Code
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={
            editor.isActive("heading", { level: 1 }) ? "is-active" : ""
          }
        >
          H1
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={
            editor.isActive("heading", { level: 2 }) ? "is-active" : ""
          }
        >
          H2
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={
            editor.isActive("heading", { level: 3 }) ? "is-active" : ""
          }
        >
          H3
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 4 }).run()
          }
          className={
            editor.isActive("heading", { level: 4 }) ? "is-active" : ""
          }
        >
          H4
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 5 }).run()
          }
          className={
            editor.isActive("heading", { level: 5 }) ? "is-active" : ""
          }
        >
          H5
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 6 }).run()
          }
          className={
            editor.isActive("heading", { level: 6 }) ? "is-active" : ""
          }
        >
          H6
        </button>
        <button onClick={() => editor.chain().focus().unsetAllMarks().run()}>
          Clear marks
        </button>
        <button onClick={() => editor.chain().focus().clearNodes().run()}>
          Clear nodes
        </button>
        <button
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={editor.isActive("paragraph") ? "is-active" : ""}
        >
          Paragraph
        </button>

        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? "is-active" : "is-active"}
        >
          Bullet list
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive("orderedList") ? "is-active" : ""}
        >
          Ordered list
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={editor.isActive("codeBlock") ? "is-active" : ""}
        >
          Code block
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive("blockquote") ? "is-active" : ""}
        >
          Blockquote
        </button>
        <button
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          Horizontal rule
        </button>
        <button onClick={() => editor.chain().focus().setHardBreak().run()}>
          Hard break
        </button>
        <button onClick={() => editor.chain().focus().undo().run()}>
          Undo
        </button>
        <button onClick={() => editor.chain().focus().redo().run()}>
          Redo
        </button>
      </div>
    </div>
  );
};
