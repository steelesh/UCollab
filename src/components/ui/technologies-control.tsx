"use client";

import { useEffect, useRef, useState } from "react";

import { Input } from "~/components/ui/input";
import TechBadge from "~/components/ui/tech-badge";

type TechnologiesControlProps = {
  readonly field: {
    readonly value: string[];
    readonly onChange: (val: string[]) => void;
  };
  readonly isSubmitting: boolean;
  readonly suggestions: string[];
  readonly handleTechSearch: (value: string) => void;
};

export default function TechnologiesControl({
  field,
  isSubmitting,
  suggestions,
  handleTechSearch,
}: TechnologiesControlProps) {
  const [techInputValue, setTechInputValue] = useState("");
  const mirrorRef = useRef<HTMLSpanElement>(null);
  const widthRef = useRef(0);

  useEffect(() => {
    if (mirrorRef.current) {
      widthRef.current = mirrorRef.current.offsetWidth;
    }
  }, [techInputValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTechInputValue(val);
    handleTechSearch(val);
  };

  const bestMatch = suggestions.find(
    sugg =>
      sugg.toLowerCase().startsWith(techInputValue.toLowerCase())
      && sugg.length > techInputValue.length,
  );
  const suggestionRemainder = bestMatch
    ? bestMatch.substring(techInputValue.length)
    : "";

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      let techToAdd: string | undefined;
      if (bestMatch) {
        techToAdd = bestMatch;
      } else {
        const found = suggestions.find(
          sugg => sugg.toLowerCase() === techInputValue.toLowerCase(),
        );
        if (found) {
          techToAdd = found;
        }
      }
      if (!techToAdd)
        return;
      if (field.value.some(t => t.toLowerCase() === techToAdd.toLowerCase()))
        return;
      field.onChange([...field.value, techToAdd]);
      setTechInputValue("");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 mb-2">
        {field.value.map((tech: string) => (
          <TechBadge
            key={tech}
            tech={tech}
            onRemove={() =>
              field.onChange(field.value.filter((t: string) => t.toLowerCase() !== tech.toLowerCase()))}
          />
        ))}
      </div>
      <div className="relative flex w-full">
        <span
          ref={mirrorRef}
          style={{
            visibility: "hidden",
            position: "absolute",
            fontFamily: "inherit",
            fontSize: "inherit",
            paddingLeft: "1rem",
            whiteSpace: "pre",
          }}
        >
          {techInputValue}
        </span>
        <Input
          id="technologies"
          type="text"
          value={techInputValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={isSubmitting}
          placeholder="Type a technology and press Enter"
          style={{ paddingLeft: "1rem" }}
        />
        {techInputValue && suggestionRemainder && (
          <span
            className="pointer-events-none absolute text-muted-foreground/50"
            style={{
              position: "absolute",
              left: widthRef.current - 1,
              top: "52%",
              transform: "translateY(-48%)",
              fontSize: "0.875rem",
              lineHeight: "1",
              fontWeight: "normal",
            }}
          >
            {suggestionRemainder}
          </span>
        )}
      </div>
    </div>
  );
}
