"use client";

import type { User } from "@prisma/client";
import type { Editor } from "@tiptap/core";
import type { SuggestionKeyDownProps, SuggestionProps } from "@tiptap/suggestion";
import type { GetReferenceClientRect, Instance } from "tippy.js";

import { ReactRenderer } from "@tiptap/react";
import Image from "next/image";
import React from "react";
import tippy from "tippy.js";

import { Button } from "~/components/ui/button";
import { searchUsers } from "~/features/users/user.actions";

type MentionUser = {
  readonly id: User["id"];
  readonly username: User["username"];
  readonly avatar?: User["avatar"];
};

type MentionListProps = {
  readonly items: MentionUser[];
  readonly command: (item: { id: User["id"]; label: User["username"] }) => void;
  readonly selectedIndex: number;
};

type MentionListRef = {
  readonly onKeyDown: (props: { event: KeyboardEvent }) => boolean;
};

type SuggestionItem = {
  readonly query: string;
  readonly editor: Editor | null;
  readonly currentUserId: string;
};

function MentionList({ items, command, selectedIndex }: MentionListProps) {
  const onKeyDown = (e: React.KeyboardEvent, item: MentionUser) => {
    if (e.key === "Enter") {
      e.preventDefault();
      command({ id: item.username, label: item.username });
    }
  };

  if (items.length === 0)
    return null;

  return (
    <div className="bg-popover rounded-md border shadow-md max-h-[200px] w-[200px] overflow-y-auto" role="listbox" aria-label="Mention suggestions">
      {items.map((item, index) => (
        <Button
          type="button"
          key={item.id}
          onClick={() => command({ id: item.username, label: item.username })}
          onKeyDown={e => onKeyDown(e, item)}
          role="option"
          aria-selected={index === selectedIndex}
          tabIndex={index === selectedIndex ? 0 : -1}
          className="relative flex w-full cursor-pointer items-center px-2 py-1.5 select-none transition-colors outline-none hover:bg-accent hover:text-accent-foreground data-[aria-selected=true]:bg-accent data-[aria-selected=true]:text-accent-foreground"
        >
          <div className="flex items-center gap-2">
            {item.avatar && (
              <Image
                src={item.avatar}
                alt={`${item.username}'s avatar`}
                className="h-6 w-6 rounded-full"
                width={24}
                height={24}
              />
            )}
            <span>{item.username}</span>
          </div>
        </Button>
      ))}
    </div>
  );
}

const suggestion = {
  char: "@",

  items: async ({ query, currentUserId }: SuggestionItem) => {
    return await searchUsers(query || "", currentUserId);
  },

  render: () => {
    let component: ReactRenderer<MentionListRef, MentionListProps>;
    let popup: Instance[];
    let lastQuery = "";
    let lastItems: MentionUser[] = [];
    let commandFn: ((item: { id: string; label: string }) => void) | null = null;

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

        const element = document.createElement("div");
        document.body.appendChild(element);

        const getReferenceClientRect: GetReferenceClientRect = () => {
          const rect = props.clientRect?.();
          if (!rect) {
            return new DOMRect(0, 0, 0, 0);
          }
          return rect;
        };

        popup = [
          tippy(element, {
            getReferenceClientRect,
            appendTo: () => document.body,
            content: component.element,
            showOnCreate: true,
            interactive: true,
            trigger: "manual",
            placement: "bottom-start",
            theme: "mention-suggestions",
          }),
        ];
      },

      onUpdate: (props: SuggestionProps) => {
        lastQuery = props.query || "";
        lastItems = props.items as MentionUser[];
        commandFn = props.command;

        if (props.items?.length) {
          const getReferenceClientRect: GetReferenceClientRect = () => {
            const rect = props.clientRect?.();
            if (!rect) {
              return new DOMRect(0, 0, 0, 0);
            }
            return rect;
          };

          component.updateProps({
            ...props,
            selectedIndex: 0,
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

        if (event.key === " " && lastQuery && lastItems.length === 1) {
          const exactMatch = lastItems[0];
          if (exactMatch && exactMatch.username.toLowerCase() === lastQuery.toLowerCase()) {
            event.preventDefault();
            commandFn?.({ id: exactMatch.username, label: exactMatch.username });
            return true;
          }
        }

        if (event.key === "Escape") {
          popup?.[0]?.hide();
          return true;
        }

        if (component?.ref?.onKeyDown) {
          return component.ref.onKeyDown({ event });
        }

        return false;
      },

      onExit: () => {
        commandFn = null;
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
    class: "tiptap-mention",
  },
};

export default suggestion;
