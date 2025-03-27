"use client";

import type { NodeObject } from "react-force-graph-2d";

import dynamic from "next/dynamic";
import React from "react";

const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), { ssr: false });

type GraphNode = {
  id: string;
  value: number;
  color: string;
  label: string;
  avatar: string;
  score?: number;
} & NodeObject;

type GraphLink = {
  source: string;
  target: string;
  score?: number;
} & NodeObject;

type GraphData = {
  nodes: GraphNode[];
  links: GraphLink[];
};

type MentorshipGraphProps = {
  graphData: GraphData;
};

export function MentorshipGraph({ graphData }: MentorshipGraphProps) {
  return (
    <ForceGraph2D
      graphData={graphData}
      nodeLabel="label"
      nodeVal="value"
      nodeColor="color"
      linkColor="color"
      backgroundColor="#0a0a0a"
      height={600}
      width={800}
      onNodeClick={(node) => {
        if (node && typeof node.label === "string") {
          const username = node.label.split(" (")[0];
          window.open(`/u/${username}`, "_blank");
        }
      }}
      nodeCanvasObject={(node, ctx) => {
        if (node.x === undefined || node.y === undefined)
          return;
        const size = Math.max(20, node.value);
        ctx.save();
        ctx.beginPath();
        ctx.arc(node.x, node.y, size / 2, 0, 2 * Math.PI, false);
        ctx.clip();
        const img = new Image();
        img.src = node.avatar;
        ctx.drawImage(img, node.x - size / 2, node.y - size / 2, size, size);
        ctx.restore();
        ctx.beginPath();
        ctx.arc(node.x, node.y, size / 2, 0, 2 * Math.PI, false);
        ctx.lineWidth = 2;
        ctx.strokeStyle = node.color;
        ctx.stroke();
      }}
    />
  );
}
