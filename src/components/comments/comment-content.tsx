type CommentContentProps = {
  content: string;
  className?: string;
};

export function CommentContent({ content, className = "" }: CommentContentProps) {
  const processedContent = content.replace(
    /<span class="(?:mention|tiptap-mention)">@([^<]+)<\/span>/g,
    (_, username) => `<span class="bg-accent/10 text-primary rounded px-1.5 py-0.5 font-semibold">@${username}</span>`,
  );

  return (
    <div
      className={`text-sm ${className}`}
      // eslint-disable-next-line react-dom/no-dangerously-set-innerhtml
      dangerouslySetInnerHTML={{ __html: processedContent }}
    />
  );
}
