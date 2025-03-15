'use client';

import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Mention from '@tiptap/extension-mention';
import { useEffect, forwardRef } from 'react';
import mentionSuggestion from './mention-suggestion';
import { User, Comment } from '@prisma/client';

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
  if (!editor) {
    return null;
  }

  return (
    <div className="tiptap-menu">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'is-active' : ''}>
        <b>B</b>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'is-active' : ''}>
        <i>I</i>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={editor.isActive('strike') ? 'is-active' : ''}>
        <s>S</s>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={editor.isActive('code') ? 'is-active' : ''}>
        {'</>'}
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive('bulletList') ? 'is-active' : ''}>
        • List
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive('orderedList') ? 'is-active' : ''}>
        1. List
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={editor.isActive('blockquote') ? 'is-active' : ''}>
        "Quote"
      </button>
    </div>
  );
};

const Tiptap = forwardRef<TiptapRef, TiptapProps>(({ content, onChange, disabled = false, currentUserId }, ref) => {
  const editor = useEditor({
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
