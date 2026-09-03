"use client";

import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Italic, List, Heading1, Heading2, RotateCcw, RotateCw, Pilcrow } from "lucide-react";

interface TipTapEditorProps {
  value: string;
  onChange: (html: string) => void;
}

export default function TipTapEditor({ value, onChange }: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-invert max-w-none text-sm text-slate-600 bg-slate-100/60 border border-slate-200 focus:border-accent-blue rounded-xl p-4 min-h-[160px] focus:outline-none focus:ring-0",
      },
    },
  });

  // Keep content in sync with external value updates (e.g. form resets or edits)
  useEffect(() => {
    if (editor && editor.getHTML() !== value) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor) {
    return <div className="h-44 w-full bg-slate-100/60 animate-pulse rounded-xl" />;
  }

  return (
    <div className="flex flex-col gap-2 w-full text-left">
      {/* Toolbar controls */}
      <div className="flex flex-wrap gap-1 p-1.5 rounded-xl border border-slate-200 glass-panel w-fit">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded-lg transition-colors cursor-pointer ${
            editor.isActive("bold") ? "bg-accent-blue/15 text-accent-blue" : "text-slate-500 hover:text-white"
          }`}
          title="Bold"
        >
          <Bold className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded-lg transition-colors cursor-pointer ${
            editor.isActive("italic") ? "bg-accent-blue/15 text-accent-blue" : "text-slate-500 hover:text-white"
          }`}
          title="Italic"
        >
          <Italic className="w-3.5 h-3.5" />
        </button>

        <div className="w-[1px] bg-white/10 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-2 rounded-lg transition-colors cursor-pointer ${
            editor.isActive("heading", { level: 1 }) ? "bg-accent-blue/15 text-accent-blue" : "text-slate-500 hover:text-white"
          }`}
          title="Heading 1"
        >
          <Heading1 className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded-lg transition-colors cursor-pointer ${
            editor.isActive("heading", { level: 2 }) ? "bg-accent-blue/15 text-accent-blue" : "text-slate-500 hover:text-white"
          }`}
          title="Heading 2"
        >
          <Heading2 className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={`p-2 rounded-lg transition-colors cursor-pointer ${
            editor.isActive("paragraph") ? "bg-accent-blue/15 text-accent-blue" : "text-slate-500 hover:text-white"
          }`}
          title="Paragraph"
        >
          <Pilcrow className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded-lg transition-colors cursor-pointer ${
            editor.isActive("bulletList") ? "bg-accent-blue/15 text-accent-blue" : "text-slate-500 hover:text-white"
          }`}
          title="Bullet List"
        >
          <List className="w-3.5 h-3.5" />
        </button>

        <div className="w-[1px] bg-white/10 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-2 rounded-lg text-slate-500 hover:text-white hover:bg-slate-100/60 disabled:opacity-20 cursor-pointer"
          title="Undo"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-2 rounded-lg text-slate-500 hover:text-white hover:bg-slate-100/60 disabled:opacity-20 cursor-pointer"
          title="Redo"
        >
          <RotateCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Editor Content Area */}
      <EditorContent editor={editor} />
    </div>
  );
}
