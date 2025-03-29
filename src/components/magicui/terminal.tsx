"use client";

import type { MotionProps } from "motion/react";

import { Check, Copy } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { cn } from "~/lib/utils";

type AnimatedSpanProps = {
  children: React.ReactNode;
  delay?: number;
  className?: string;
} & MotionProps;

export function AnimatedSpan({
  children,
  delay = 0,
  className,
  ...props
}: AnimatedSpanProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: delay / 1000 }}
      className={cn("grid text-sm font-normal tracking-tight select-none", className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

type TypingAnimationProps = {
  children: string;
  className?: string;
  duration?: number;
  delay?: number;
  as?: React.ElementType;
} & MotionProps;

export function TypingAnimation({
  children,
  className,
  duration = 60,
  delay = 0,
  as: Component = "span",
  ...props
}: TypingAnimationProps) {
  if (typeof children !== "string") {
    throw new TypeError("TypingAnimation: children must be a string. Received:");
  }

  const MotionComponent = motion.create(Component, {
    forwardMotionProps: true,
  });

  const [displayedText, setDisplayedText] = useState<string>("");
  const [started, setStarted] = useState(false);
  const elementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const startTimeout = setTimeout(() => {
      setStarted(true);
    }, delay);
    return () => clearTimeout(startTimeout);
  }, [delay]);

  useEffect(() => {
    if (!started)
      return;

    let i = 0;
    const typingEffect = setInterval(() => {
      if (i < children.length) {
        setDisplayedText(children.substring(0, i + 1));
        i++;
      } else {
        clearInterval(typingEffect);
      }
    }, duration);

    return () => {
      clearInterval(typingEffect);
    };
  }, [children, duration, started]);

  return (
    <MotionComponent
      ref={elementRef}
      className={cn("text-sm font-normal tracking-tight text-white select-text", className)}
      {...props}
    >
      {displayedText}
    </MotionComponent>
  );
}

type TerminalProps = {
  children: React.ReactNode;
  className?: string;
  prompt?: string;
  delay?: number;
};

export function Terminal({ children, className, prompt = "$" }: TerminalProps) {
  const [copied, setCopied] = useState(false);
  const commandRef = useRef<HTMLSpanElement>(null);

  const copyCommand = () => {
    if (commandRef.current) {
      const text = commandRef.current.textContent;
      if (text) {
        const parts = text.split("✔");
        if (parts[0]) {
          navigator.clipboard.writeText(parts[0].trim());
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }
      }
    }
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-gradient-to-br from-neutral-950 to-neutral-900 text-neutral-100 border border-neutral-800/30 shadow-[0_0_20px_rgba(0,0,0,0.35),0_0_4px_rgba(255,255,255,0.12)] backdrop-blur-sm hover:shadow-[0_0_30px_rgba(0,0,0,0.45),0_0_6px_rgba(255,255,255,0.18)] hover:border-neutral-700/50 transition-all duration-500 ease-in-out z-0 h-full max-h-[400px] w-full max-w-lg rounded-xl",
        className,
      )}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>
      <button
        type="button"
        onClick={copyCommand}
        className="absolute top-2 right-2 z-20 flex items-center cursor-pointer gap-1.5 px-2 py-1 text-xs text-muted-foreground hover:text-white transition-colors duration-200 rounded-md "
      >
        {copied
          ? (
              <span className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5" />
                <span>Copied!</span>
              </span>
            )
          : (
              <span className="flex items-center gap-1.5">
                <Copy className="h-3.5 w-3.5" />
                <span>Copy</span>
              </span>
            )}
      </button>
      <div className="relative z-10">
        <div className="flex flex-col gap-y-2 border-b border-neutral-800/30 p-4">
          <div className="flex flex-row gap-x-2">
            <div className="h-2 w-2 rounded-full bg-red-500"></div>
            <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
          </div>
        </div>
        <pre className="p-4">
          <code className="grid gap-y-1 overflow-auto">
            <div className="group">
              <span className="text-muted-foreground mr-2 select-none">{prompt}</span>
              <span ref={commandRef} className="text-white select-text">
                {children}
              </span>
            </div>
          </code>
        </pre>
      </div>
    </div>
  );
}
