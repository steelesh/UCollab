"use client";

import { useEffect, useRef, useState } from "react";

import { Badge } from "~/components/ui/badge";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

type TechnologiesControlProps = {
  field: {
    value: string[];
    onChange: (val: string[]) => void;
  };
  isSubmitting: boolean;
  suggestions: string[];
  handleTechSearch: (value: string) => void;
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
      } else if (suggestions.includes(techInputValue)) {
        techToAdd = techInputValue;
      }
      if (!techToAdd)
        return;
      if (field.value.includes(techToAdd))
        return;
      field.onChange([...field.value, techToAdd]);
      setTechInputValue("");
    }
  };

  return (
    <div className="form-control">
      <Label htmlFor="technologies" className="label">
        <span className="label-text">Technologies</span>
      </Label>
      <div className="m-4 flex flex-1">
        {field.value.map((tech: string) => (
          <Badge
            key={tech}
            onClick={() => field.onChange(field.value.filter((t: string) => t !== tech))}
            className="hover:bg-primary cursor-pointer transition duration-200 ease-in-out hover:scale-105"
            variant="outline"
          >
            {tech}
          </Badge>
        ))}
      </div>
      <div className="relative flex w-full items-center">
        <span
          ref={mirrorRef}
          className="invisible absolute text-sm leading-none font-normal whitespace-pre"
          style={{
            fontFamily: "inherit",
            fontSize: "inherit",
            paddingLeft: "1rem",
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
          className="input input-bordered w-full bg-transparent leading-none"
          disabled={isSubmitting}
          style={{ color: "white", caretColor: "white", paddingLeft: "1rem" }}
        />
        {techInputValue && suggestionRemainder && (
          <span
            className="pointer-events-none absolute text-sm leading-none font-normal text-white/50"
            style={{
              left: widthRef.current - 1,
              top: "50%",
              transform: "translateY(-47%)",
            }}
          >
            {suggestionRemainder}
          </span>
        )}
      </div>
    </div>
  );
}
