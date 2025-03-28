"use client";

import { motion } from "framer-motion";
import { useState } from "react";

type GraduationYearControlProps = {
  initialYear?: string;
  currentYear: number;
};

export default function GraduationYearControl({ initialYear, currentYear }: GraduationYearControlProps) {
  const [selected, setSelected] = useState<number>(() => (initialYear ? Number(initialYear) : currentYear));
  const [focused, setFocused] = useState<number | null>(null);

  const years = Array.from({ length: 5 }, (_, i) => currentYear + i);

  return (
    <>
      <div className="form-control">
        <div onMouseLeave={() => setFocused(null)} className="flex items-center">
          {years.map((year, index) => (
            <div key={year} className="flex items-center">
              <button
                type="button"
                onMouseEnter={() => setFocused(year)}
                onFocus={() => setFocused(year)}
                onClick={() => setSelected(year)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    setSelected(year);
                  }
                }}
                className="relative cursor-pointer border-none bg-transparent px-2 py-1 focus:outline-none"
              >
                <span className="relative z-10 text-xs">{year}</span>
                {focused === year && (
                  <motion.div
                    transition={{ layout: { duration: 0.2, ease: "easeOut" } }}
                    className="bg-muted absolute right-0 bottom-[-2px] left-[-10px] z-0 h-full w-[140%] rounded-md"
                    layoutId="highlight"
                  />
                )}
                {selected === year && (
                  <motion.div
                    className="bg-primary absolute right-0 bottom-[-10px] left-0 z-0 h-[4px] rounded-md"
                    layoutId="underline"
                  />
                )}
              </button>
              {index < years.length - 1 && <span className="mx-2 text-xs text-gray-500">|</span>}
            </div>
          ))}
        </div>
      </div>
      {/* Hidden input so that the value is submitted with the form */}
      <input type="hidden" id="gradYear" name="gradYear" value={selected} />
    </>
  );
}
