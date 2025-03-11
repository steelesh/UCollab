'use client';

import { ReactRenderer } from '@tiptap/react';
import tippy, { Instance, Props, GetReferenceClientRect } from 'tippy.js';
import { searchUsers } from '~/features/users/user.actions';
import { SuggestionProps, SuggestionKeyDownProps } from '@tiptap/suggestion';
import { Editor } from '@tiptap/core';
import { User } from '@prisma/client';
import Image from 'next/image';

interface MentionUser {
  id: User['id'];
  username: User['username'];
  avatar?: User['avatar'];
}

interface MentionListProps {
  items: MentionUser[];
  command: (item: { id: User['id']; label: User['username'] }) => void;
  selectedIndex: number;
}

interface MentionListRef {
  onKeyDown: (props: { event: KeyboardEvent }) => boolean;
}

interface SuggestionItem {
  query: string;
  editor: Editor | null;
  currentUserId: string;
}

const MentionList = ({ items, command, selectedIndex }: MentionListProps) => {
  const onKeyDown = (e: React.KeyboardEvent, item: MentionUser) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      command({ id: item.username, label: item.username });
    }
  };

  if (items.length === 0) return null;

  return (
    <div className="dropdown-container" role="listbox" aria-label="Mention suggestions">
      {items.map((item, index) => (
        <button
          key={item.id}
          onClick={() => command({ id: item.username, label: item.username })}
          onKeyDown={(e) => onKeyDown(e, item)}
          role="option"
          aria-selected={index === selectedIndex}
          tabIndex={index === selectedIndex ? 0 : -1}
          className={`dropdown-item ${index === selectedIndex ? 'bg-accent text-accent-foreground' : ''}`}>
          <div className="dropdown-item-content">
            {item.avatar && (
              <Image
                src={item.avatar}
                alt={`${item.username}'s avatar`}
                width={24}
                height={24}
                className="rounded-full"
              />
            )}
            <span>{item.username}</span>
          </div>
        </button>
      ))}
    </div>
  );
};

const suggestion = {
  char: '@',

  items: async ({ query, currentUserId }: SuggestionItem) => {
    const users = await searchUsers(query || '', currentUserId);
    return users;
  },

  render: () => {
    let component: ReactRenderer<MentionListRef, MentionListProps>;
    let popup: Instance<Props>[];
    let lastQuery = '';
    let lastItems: MentionUser[] = [];
    let commandFn: ((item: { id: string; label: string }) => void) | null = null;
    let selectedIndex = 0;

    return {
      onStart: (props: SuggestionProps) => {
        commandFn = props.command;
        component = new ReactRenderer(MentionList, {
          props: {
            ...props,
            selectedIndex: 0,
          },
          editor: props.editor,
        });

        const element = document.createElement('div');
        document.body.appendChild(element);

        const getReferenceClientRect: GetReferenceClientRect = () => {
          const rect = props.clientRect?.();
          if (!rect) {
            return new DOMRect(0, 0, 0, 0);
          }
          return rect as DOMRect;
        };

        popup = [
          tippy(element, {
            getReferenceClientRect,
            appendTo: () => document.body,
            content: component.element,
            showOnCreate: true,
            interactive: true,
            trigger: 'manual',
            placement: 'bottom-start',
            theme: 'mention-suggestions',
          }),
        ];
      },

      onUpdate: (props: SuggestionProps) => {
        lastQuery = props.query || '';
        lastItems = props.items as MentionUser[];
        commandFn = props.command;

        selectedIndex = 0;

        if (props.items?.length) {
          const getReferenceClientRect: GetReferenceClientRect = () => {
            const rect = props.clientRect?.();
            if (!rect) {
              return new DOMRect(0, 0, 0, 0);
            }
            return rect as DOMRect;
          };

          component.updateProps({
            ...props,
            selectedIndex,
          });

          if (popup?.[0]) {
            popup[0].setProps({
              getReferenceClientRect,
            });
            popup[0].show();
          }
        } else {
          popup?.[0]?.hide();
        }

        if (lastQuery && lastItems.length === 1) {
          const exactMatch = lastItems[0];
          if (exactMatch && exactMatch.username.toLowerCase() === lastQuery.toLowerCase()) {
            setTimeout(() => {
              commandFn?.({ id: exactMatch.username, label: exactMatch.username });
            }, 50);
          }
        }
      },

      onKeyDown: (props: SuggestionKeyDownProps) => {
        const { event } = props;

        if (event.key === 'Enter' && lastItems.length > 0) {
          event.preventDefault();
          const selectedItem = lastItems[selectedIndex];
          if (selectedItem) {
            commandFn?.({ id: selectedItem.username, label: selectedItem.username });
          }
          return true;
        }

        if (event.key === 'ArrowUp') {
          event.preventDefault();
          selectedIndex = (selectedIndex - 1 + lastItems.length) % lastItems.length;
          component.updateProps({ selectedIndex });
          return true;
        }

        if (event.key === 'ArrowDown') {
          event.preventDefault();
          selectedIndex = (selectedIndex + 1) % lastItems.length;
          component.updateProps({ selectedIndex });
          return true;
        }

        if (event.key === 'Escape') {
          popup?.[0]?.hide();
          return true;
        }

        return false;
      },

      onExit: () => {
        commandFn = null;
        selectedIndex = 0;
        if (popup?.[0]) {
          popup[0].destroy();
        }
        if (component) {
          component.destroy();
        }
      },
    };
  },

  allowSpaces: false,
  HTMLAttributes: {
    class: 'tiptap-mention',
  },
};

export default suggestion;
