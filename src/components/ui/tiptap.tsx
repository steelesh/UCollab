'use client';

import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Mention from '@tiptap/extension-mention';
import { useEffect, forwardRef } from 'react';
import mentionSuggestion from './mention-suggestion';
import { User, Comment } from '@prisma/client';
import { ToggleGroup, ToggleGroupItem } from '~/components/ui/toggle-group';
import { Bold, Italic, Strikethrough, Code, List, ListOrdered, Quote } from 'lucide-react';

interface TiptapProps {
  content: Comment['content'];
  onChange: (content: Comment['content']) => void;
  disabled?: boolean;
  currentUserId: User['id'];
}

export interface TiptapRef {
  clearContent: () => void;
}

const MenuBar = ({ editor }: { editor: Editor }) => {
  if (!editor) return null;

  return (
    <div className="bg-muted/50 w-full border-b p-2">
      <ToggleGroup type="multiple">
        <ToggleGroupItem
          value="bold"
          aria-label="Toggle bold"
          onClick={() => editor.chain().focus().toggleBold().run()}
          data-state={editor.isActive('bold') ? 'on' : 'off'}>
          <Bold className="h-4 w-4" />
        </ToggleGroupItem>

        <ToggleGroupItem
          value="italic"
          aria-label="Toggle italic"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          data-state={editor.isActive('italic') ? 'on' : 'off'}>
          <Italic className="h-4 w-4" />
        </ToggleGroupItem>

        <ToggleGroupItem
          value="strike"
          aria-label="Toggle strikethrough"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          data-state={editor.isActive('strike') ? 'on' : 'off'}>
          <Strikethrough className="h-4 w-4" />
        </ToggleGroupItem>

        <ToggleGroupItem
          value="code"
          aria-label="Toggle code"
          onClick={() => editor.chain().focus().toggleCode().run()}
          data-state={editor.isActive('code') ? 'on' : 'off'}>
          <Code className="h-4 w-4" />
        </ToggleGroupItem>

        <ToggleGroupItem
          value="bulletList"
          aria-label="Toggle bullet list"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          data-state={editor.isActive('bulletList') ? 'on' : 'off'}>
          <List className="h-4 w-4" />
        </ToggleGroupItem>

        <ToggleGroupItem
          value="orderedList"
          aria-label="Toggle ordered list"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          data-state={editor.isActive('orderedList') ? 'on' : 'off'}>
          <ListOrdered className="h-4 w-4" />
        </ToggleGroupItem>

        <ToggleGroupItem
          value="blockquote"
          aria-label="Toggle blockquote"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          data-state={editor.isActive('blockquote') ? 'on' : 'off'}>
          <Quote className="h-4 w-4" />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};

const Tiptap = forwardRef<TiptapRef, TiptapProps>(({ content, onChange, disabled = false, currentUserId }, ref) => {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        blockquote: undefined,
        bulletList: undefined,
        listItem: undefined,
        orderedList: undefined,
        bold: undefined,
        italic: undefined,
        strike: undefined,
        code: undefined,
        history: undefined,
        dropcursor: undefined,
        gapcursor: undefined,
        codeBlock: false,
        heading: false,
        horizontalRule: false,
      }),
      Mention.configure({
        HTMLAttributes: {
          class: 'tiptap-mention',
          'data-type': 'mention',
        },
        renderLabel({ node }) {
          return `@${node.attrs.label ?? node.attrs.id}`;
        },
        suggestion: {
          char: '@',
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
                {
                  type: 'mention',
                  attrs: props,
                },
                {
                  type: 'text',
                  text: ' ',
                },
              ])
              .run();
          },
        },
      }),
    ],
    content,
    editable: !disabled,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (ref && 'current' in ref) {
      ref.current = {
        clearContent: () => {
          editor?.commands.clearContent();
        },
      };
    }
  }, [editor, ref]);

  useEffect(() => {
    editor?.setEditable(!disabled);
  }, [editor, disabled]);

  useEffect(() => {
    return () => {
      editor?.destroy();
    };
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="tiptap-container">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} className="tiptap-content" />
    </div>
  );
});

Tiptap.displayName = 'Tiptap';

export default Tiptap;
