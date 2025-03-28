"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { searchTechnologies, updateOnboarding } from "~/features/users/user.actions";
import { onboardingSchema } from "~/features/users/user.schema";

export type OnboardingInput = {
  gradYear: string;
  technologies: string[];
  githubProfile: string;
  mentorshipStatus: "MENTOR" | "MENTEE" | "NONE";
};

function GraduationYearControl({ field, currentYear }: { field: any; currentYear: number }) {
  const years = Array.from({ length: 5 }, (_, i) => currentYear + i);
  const initialSelected = field.value ? Number(field.value) : currentYear;
  const [focused, setFocused] = useState<number | null>(null);
  const [selected, setSelected] = useState<number>(initialSelected);

  useEffect(() => {
    if (!field.value) {
      field.onChange(String(currentYear));
    }
  }, [field, currentYear]);

  return (
    <div className="form-control">
      <Label htmlFor="gradYear" className="label">
        <span className="label-text">Graduation Year</span>
      </Label>
      <div onMouseLeave={() => setFocused(null)} className="flex items-center">
        {years.map((year, index) => (
          <div key={year} className="flex items-center">
            <button
              type="button"
              onMouseEnter={() => setFocused(year)}
              onFocus={() => setFocused(year)}
              onClick={() => {
                setSelected(year);
                field.onChange(String(year));
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  setSelected(year);
                  field.onChange(String(year));
                }
              }}
              className="relative cursor-pointer border-none bg-transparent px-2 py-1 focus:outline-none"
            >
              <span className="relative z-10 text-xs">{year}</span>
              {focused === year && (
                <motion.div
                  transition={{ layout: { duration: 0.2, ease: "easeOut" } }}
                  className="bg-muted absolute right-0 bottom-[-2px] left-[-10px] z-0 h-[100%] w-[140%] rounded-md"
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
  );
}

function TechnologiesControl({ field, isSubmitting, suggestions, handleTechSearch }: {
  field: any;
  isSubmitting: boolean;
  suggestions: string[];
  handleTechSearch: (value: string) => void;
}) {
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
    sugg => sugg.toLowerCase().startsWith(techInputValue.toLowerCase()) && sugg.length > techInputValue.length,
  );
  const suggestionRemainder = bestMatch ? bestMatch.substring(techInputValue.length) : "";

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
      <Label className="label" htmlFor="technologies">
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

export function OnboardingForm() {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<OnboardingInput>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      gradYear: "",
      technologies: [],
      githubProfile: "",
      mentorshipStatus: "NONE",
    },
  });

  const technologies = watch("technologies");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const handleTechSearch = async (value: string) => {
    if (value.length >= 2) {
      try {
        const results = await searchTechnologies(value);
        setSuggestions(results?.filter(tech => !technologies.includes(tech)) || []);
      } catch (error) {
        console.error("Failed to fetch suggestions:", error);
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  const onSubmit = async (data: OnboardingInput) => {
    const formData = new FormData();
    formData.append("gradYear", data.gradYear);
    formData.append("technologies", JSON.stringify(data.technologies));
    formData.append("githubProfile", data.githubProfile);
    formData.append("projectType", data.mentorshipStatus);
    formData.append("mentorshipStatus", data.mentorshipStatus || "NONE");
    try {
      await updateOnboarding(formData);
    } catch (error) {
      console.error("Error updating onboarding:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 rounded-lg border p-8">
      <Controller
        name="gradYear"
        control={control}
        render={({ field }) => (
          <GraduationYearControl field={field} currentYear={new Date().getFullYear()} />
        )}
      />
      <div className="form-control relative">
        <Controller
          control={control}
          name="technologies"
          render={({ field }) => (
            <TechnologiesControl
              field={field}
              isSubmitting={isSubmitting}
              suggestions={suggestions}
              handleTechSearch={handleTechSearch}
            />
          )}
        />
        {errors.technologies && <span className="text-error text-sm">{errors.technologies.message}</span>}
      </div>
      <div className="form-control">
        <Label className="label" htmlFor="githubRepo">
          <span className="label-text">GitHub Repository</span>
        </Label>
        <Input
          {...register("githubProfile")}
          className="input input-bordered w-full"
          placeholder="https://github.com/username/repo"
          disabled={isSubmitting}
        />
        {errors.githubProfile && <span className="text-error text-sm">{errors.githubProfile.message}</span>}
      </div>
      <div className="form-control mt-2">
        <Label className="label my-2">
          <span className="label-text">Mentorship Status</span>
        </Label>
        <Controller
          control={control}
          name="mentorshipStatus"
          defaultValue="NONE"
          render={({ field: { onChange, value } }) => (
            <RadioGroup value={value ?? "NONE"} onValueChange={onChange}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="MENTOR" id="mentor" />
                <Label htmlFor="mentor">Mentor</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="MENTEE" id="mentee" />
                <Label htmlFor="mentee">Mentee</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="NONE" id="none" />
                <Label htmlFor="none">None</Label>
              </div>
            </RadioGroup>
          )}
        />
        {errors.mentorshipStatus && <span className="text-error text-sm">{errors.mentorshipStatus.message}</span>}
      </div>
      <Button
        type="submit"
        className="w-full cursor-pointer bg-green-600 hover:bg-green-600/80"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Saving..." : "Submit"}
      </Button>
    </form>
  );
}
