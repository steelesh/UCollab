"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";

type FilterVariant = "projects" | "mentorship";

type FilterOption = {
  value: string;
  label: string;
};

const FILTER_OPTIONS: Record<FilterVariant, FilterOption[]> = {
  projects: [
    { value: "CONTRIBUTION", label: "Projects Seeking Contributors" },
    { value: "DEVELOPER_AVAILABLE", label: "Available Developers" },
  ],
  mentorship: [
    { value: "MENTOR_AVAILABLE", label: "Available Mentors" },
    { value: "SEEKING_MENTOR", label: "Seeking Mentors" },
    { value: "GRAPH", label: "Mentorship Graph" },
  ],
};

type NeedTypeFilterProps = {
  selectedValue: string;
  variant: FilterVariant;
};

export function NeedTypeFilter({ selectedValue, variant }: NeedTypeFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleValueChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("postNeeds", value);
    params.set("page", "1");

    router.push(`?${params.toString()}`);
  };

  const options = FILTER_OPTIONS[variant];

  return (
    <div className="my-6">
      <Tabs value={selectedValue} onValueChange={handleValueChange} className="w-full">
        <TabsList className="w-full justify-start bg-background p-1 rounded-md h-auto">
          {options.map(option => (
            <TabsTrigger
              key={option.value}
              value={option.value}
              className="rounded-md bg-muted"
            >
              {option.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}

export function MentorshipNeedTypeFilter({ selectedValue }: { selectedValue: string }) {
  return <NeedTypeFilter selectedValue={selectedValue} variant="mentorship" />;
}
