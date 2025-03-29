"use client";

import { motion } from "motion/react";
import { useState } from "react";

import { Label } from "~/components/ui/label";

type MentorshipStatusControlProps = {
  field: {
    value: string;
    onChange: (value: string) => void;
  };
};

export function MentorshipStatusControl({ field }: MentorshipStatusControlProps) {
  const statuses = ["MENTOR", "MENTEE", "NONE"];
  const initialSelected = field.value || "NONE";
  const [focused, setFocused] = useState<string | null>(null);
  const [selected, setSelected] = useState<string>(initialSelected);

  return (
    <div className="form-control">
      <Label htmlFor="mentorshipStatus" className="label">
        <span className="label-text">Mentorship Status</span>
      </Label>
      <div onMouseLeave={() => setFocused(null)} className="flex items-center">
        {statuses.map((status, index) => (
          <div key={status} className="flex items-center">
            <button
              type="button"
              onMouseEnter={() => setFocused(status)}
              onFocus={() => setFocused(status)}
              onClick={() => {
                setSelected(status);
                field.onChange(status);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setSelected(status);
                  field.onChange(status);
                }
              }}
              className="relative cursor-pointer border-none bg-transparent px-2 py-1 focus:outline-none"
            >
              <span className="relative z-10 text-xs">{status}</span>
              {focused === status && (
                <motion.div
                  transition={{ layout: { duration: 0.2, ease: "easeOut" } }}
                  className="bg-muted absolute right-0 bottom-[-2px] left-[-10px] z-0 h-full w-[140%] rounded-md"
                  layoutId="highlight"
                />
              )}
              {selected === status && (
                <motion.div
                  className="bg-primary absolute right-0 bottom-[-10px] left-0 z-0 h-[4px] rounded-md"
                  layoutId="underline"
                />
              )}
            </button>
            {index < statuses.length - 1 && (
              <span className="mx-2 text-xs text-gray-500">|</span>
            )}
          </div>
        ))}
      </div>
      <input type="hidden" id="mentorshipStatus" name="mentorshipStatus" value={selected} />
    </div>
  );
}
