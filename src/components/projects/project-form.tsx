"use client";

import type { Project } from "@prisma/client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ProjectType } from "@prisma/client";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import type { CreateProjectInput } from "~/features/projects/project.schema";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import TechnologiesControl from "~/components/ui/technologies-control";
import { Textarea } from "~/components/ui/textarea";
import { createProject, searchTechnologies, updateProject } from "~/features/projects/project.actions";
import { projectSchema } from "~/features/projects/project.schema";

type ProjectFormProps = {
  initialData?: CreateProjectInput;
  projectId?: Project["id"];
};

export function ProjectForm({ initialData, projectId }: ProjectFormProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateProjectInput>({
    resolver: zodResolver(projectSchema),
    defaultValues: initialData || {
      projectType: ProjectType.FEEDBACK,
      technologies: [],
      title: "",
      description: "",
      githubRepo: "",
    },
  });

  const technologies = watch("technologies");

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

  const onSubmit = async (data: CreateProjectInput) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === "technologies") {
          formData.append(key, JSON.stringify(value));
        } else if (value) {
          formData.append(key, value.toString());
        }
      });

      if (projectId) {
        await updateProject(projectId, formData);
      } else {
        await createProject(formData);
      }
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="border-muted-foreground space-y-6 rounded-lg border p-8">
      <div className="form-control">
        <label className="label" htmlFor="title">
          <span className="label-text">Project Title</span>
        </label>
        <Input
          {...register("title")}
          className="input input-bordered w-full"
          placeholder="Enter project title"
          disabled={isSubmitting}
        />
        {errors.title && <span className="text-error text-sm">{errors.title.message}</span>}
      </div>
      <div className="form-control">
        <label className="label" htmlFor="description">
          <span className="label-text">Description</span>
        </label>
        <Textarea
          {...register("description")}
          className="textarea textarea-bordered w-full"
          placeholder="Describe your project"
          disabled={isSubmitting}
        />
        {errors.description && <span className="text-error text-sm">{errors.description.message}</span>}
      </div>
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
      <div className="form-control">
        <Label className="label" htmlFor="githubRepo">
          <span className="label-text">GitHub Repository</span>
        </Label>
        <Input
          {...register("githubRepo")}
          className="input input-bordered w-full"
          placeholder="https://github.com/username/repo"
          disabled={isSubmitting}
        />
        {errors.githubRepo && <span className="text-error text-sm">{errors.githubRepo.message}</span>}
      </div>
      <div className="form-control mt-2">
        <Label className="label my-2">
          <span className="label-text">Category</span>
        </Label>
        <Controller
          control={control}
          name="projectType"
          defaultValue="FEEDBACK"
          render={({ field: { onChange, value } }) => (
            <RadioGroup value={value ?? "FEEDBACK"} onValueChange={onChange}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="FEEDBACK" id="feedback" />
                <Label htmlFor="feedback">Feedback</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="CONTRIBUTION" id="contribution" />
                <Label htmlFor="contribution">Contribution</Label>
              </div>
            </RadioGroup>
          )}
        />
        {errors.projectType && <span className="text-error text-sm">{errors.projectType.message}</span>}
      </div>
      <Button
        type="submit"
        className="w-full cursor-pointer bg-green-600 hover:bg-green-600/80"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Saving..." : projectId ? "Update Project" : "Create Project"}
      </Button>
    </form>
  );
}
