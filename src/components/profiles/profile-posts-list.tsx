import type { Post } from "@prisma/client";
import type { Route } from "next";

import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

type ProfilePostsListProps = {
  readonly posts: Post[];
};

export function ProfilePostsList({ posts }: ProfilePostsListProps) {
  return (
    <>
      {posts.length === 0
        ? (
            <p className="text-accent-content pt-2 text-sm">No posts available.</p>
          )
        : (
            <ul className="space-y-4 py-4">
              {posts.map(post => (
                <li key={post.id} className="group bg-muted rounded-lg">
                  <Link href={`/p/${post.id}` as Route} className="block rounded-lg p-4 transition-colors">
                    <p className="line-clamp-2 text-sm font-medium hover:underline">{post.title}</p>
                    <div className="text-muted-foreground flex items-center gap-2 text-xs">
                      <time>
                        {formatDistanceToNow(new Date(post.createdDate))}
                        {" "}
                        ago
                      </time>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
    </>
  );
}
