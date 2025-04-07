"use client";

import { formatDistanceToNow } from "date-fns";
import { ArrowUpRight, Eye, MessageSquare, Star } from "lucide-react";
import { useRouter } from "next/navigation";

import { Avatar, AvatarImage } from "../ui/avatar";
import { Card, CardContent } from "../ui/card";
import { Muted } from "../ui/muted";
import { Small } from "../ui/small";

type Activity = {
  type: "comment" | "rating" | "watch";
  id: string;
  createdDate: Date;
  post: {
    id: string;
    title: string;
  };
  user: {
    id: string;
    username: string;
    avatar: string;
  };
  content?: string;
  rating?: number;
};

type ActivityCardProps = {
  activity: Activity;
};

export function ActivityCard({ activity }: ActivityCardProps) {
  const { type, createdDate, post, user } = activity;
  const router = useRouter();

  return (
    <Card
      variant="glossy"
      className="p-4 group cursor-pointer"
      onClick={() => router.push(`/p/${post.id}`)}
    >
      <CardContent className="p-0 flex items-center space-x-3">
        <div
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              router.push(`/u/${user.username}`);
            }
          }}
          className="flex-shrink-0 z-10"
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/u/${user.username}`);
          }}
        >
          <Avatar className="h-7 w-7 cursor-pointer">
            <AvatarImage src={user.avatar} alt={user.username} />
          </Avatar>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {type === "comment" && <MessageSquare className="w-3.5 h-3.5 text-blue-500" />}
            {type === "rating" && <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-400" />}
            {type === "watch" && <Eye className="w-3.5 h-3.5 text-green-500" />}
            <Small noMargin className="truncate">
              <span>{user.username}</span>
              {type === "comment" && " commented on "}
              {type === "rating" && ` rated (${activity.rating}★) `}
              {type === "watch" && " started watching "}
              <span
                className="inline-flex items-center"
              >
                {post.title}
                <ArrowUpRight className="w-3 h-3 ml-0.5 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out" />
              </span>
            </Small>
          </div>
          <Muted className="text-xs mt-1">
            {formatDistanceToNow(new Date(createdDate), { addSuffix: true })}
          </Muted>
        </div>
      </CardContent>
    </Card>
  );
}

export function NoActivityPlaceholder() {
  return (
    <p className="mt-2">No recent activity to display.</p>
  );
}
