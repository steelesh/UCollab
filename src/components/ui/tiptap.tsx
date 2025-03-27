"use client";

import type { Comment, User } from "@prisma/client";
import type { Editor } from "@tiptap/react";

import Mention from "@tiptap/extension-mention";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Code, Italic, List, ListOrdered, Quote, Strikethrough } from "lucide-react";
import { useEffect } from "react";

import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";

import mentionSuggestion from "./mention-suggestion";

type TiptapProps = {
  content: Comment["content"];
  onChange: (content: Comment["content"]) => void;
  disabled?: boolean;
  currentUserId: User["id"];
};

export type TiptapRef = {
  clearContent: () => void;
};

function MenuBar({ editor }: { editor: Editor }) {
  if (!editor)
    return null;

  return (
    <div className="flex gap-1 border-b bg-muted/50 p-2">
      <ToggleGroup type="multiple">
        <ToggleGroupItem
          value="bold"
          aria-label="Toggle bold"
          onClick={() => editor.chain().focus().toggleBold().run()}
          data-state={editor.isActive("bold") ? "on" : "off"}
        >
          <Bold className="h-4 w-4" />
        </ToggleGroupItem>

        <ToggleGroupItem
          value="italic"
          aria-label="Toggle italic"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          data-state={editor.isActive("italic") ? "on" : "off"}
        >
          <Italic className="h-4 w-4" />
        </ToggleGroupItem>

        <ToggleGroupItem
          value="strike"
          aria-label="Toggle strikethrough"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          data-state={editor.isActive("strike") ? "on" : "off"}
        >
          <Strikethrough className="h-4 w-4" />
        </ToggleGroupItem>

        <ToggleGroupItem
          value="code"
          aria-label="Toggle code"
          onClick={() => editor.chain().focus().toggleCode().run()}
          data-state={editor.isActive("code") ? "on" : "off"}
        >
          <Code className="h-4 w-4" />
        </ToggleGroupItem>

        <ToggleGroupItem
          value="bulletList"
          aria-label="Toggle bullet list"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          data-state={editor.isActive("bulletList") ? "on" : "off"}
        >
          <List className="h-4 w-4" />
        </ToggleGroupItem>

        <ToggleGroupItem
          value="orderedList"
          aria-label="Toggle ordered list"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          data-state={editor.isActive("orderedList") ? "on" : "off"}
        >
          <ListOrdered className="h-4 w-4" />
        </ToggleGroupItem>

        <ToggleGroupItem
          value="blockquote"
          aria-label="Toggle blockquote"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          data-state={editor.isActive("blockquote") ? "on" : "off"}
        >
          <Quote className="h-4 w-4" />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}

function Tiptap({ ref, content, onChange, disabled = false, currentUserId }: TiptapProps & { ref?: React.RefObject<TiptapRef | null> }) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        codeBlock: false,
        heading: false,
        horizontalRule: false,
        blockquote: false,
        bulletList: false,
        listItem: false,
        orderedList: false,
        bold: false,
        italic: false,
        strike: false,
        code: false,
        history: false,
        dropcursor: false,
        gapcursor: false,
      }),
      Mention.configure({
        HTMLAttributes: { class: "bg-accent/10 text-primary rounded px-1.5 py-0.5 font-semibold" },
        renderLabel: ({ node }) => `@${node.attrs.label ?? node.attrs.id}`,
        suggestion: {
          char: "@",
          allowSpaces: true,
          items: ({ query, editor }) =>
            mentionSuggestion.items({
              query,
              editor,
              currentUserId,
            }),
          render: mentionSuggestion.render,
          command: ({ editor, range, props }) => {
            editor
              .chain()
              .focus()
              .insertContentAt(range, [
                { type: "mention", attrs: { ...props, class: "bg-accent/10 text-primary rounded px-1.5 py-0.5 font-semibold" } },
                { type: "text", text: " " },
              ])
              .run();
          },
        },
      }),
    ],
    content,
    editable: !disabled,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  useEffect(() => {
    if (ref && "current" in ref) {
      ref.current = {
        clearContent: () => editor?.commands.clearContent(),
      };
    }
  }, [editor, ref]);

  useEffect(() => {
    editor?.setEditable(!disabled);
  }, [editor, disabled]);

  useEffect(() => {
    return () => editor?.destroy();
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="rounded-lg border">
      <MenuBar editor={editor} />
      <div className="min-h-[100px] max-w-none p-3 pt-2">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

Tiptap.displayName = "Tiptap";

export default Tiptap;
