'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect, useRef } from 'react';
import { createProject, updateProject, searchTechnologies } from '~/features/projects/project.actions';
import { CreateProjectInput, projectSchema } from '~/features/projects/project.schema';
import { PostType, Project } from '@prisma/client';
import { Button } from '~/components/ui/button';
import { Label } from '~/components/ui/label';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import { Badge } from '~/components/ui/badge';

interface ProjectFormProps {
  initialData?: CreateProjectInput;
  projectId?: Project['id'];
}

export function ProjectForm({ initialData, projectId }: ProjectFormProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const techInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateProjectInput>({
    resolver: zodResolver(projectSchema),
    defaultValues: initialData || {
      postType: PostType.DISCUSSION,
      technologies: [],
      title: '',
      description: '',
      githubRepo: '',
    },
  });

  const technologies = watch('technologies');

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTechSearch = async (value: string) => {
    if (value.length >= 2) {
      try {
        const results = await searchTechnologies(value);
        setSuggestions(results?.filter((tech) => !technologies.includes(tech)) || []);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Failed to fetch suggestions:', error);
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const onSubmit = async (data: CreateProjectInput) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'technologies') {
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
      console.error('Form submission error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="border-muted-foreground space-y-6 rounded-lg border p-8">
      <div className="form-control">
        <label className="label" htmlFor="title">
          <span className="label-text">Project Title</span>
        </label>
        <Input
          {...register('title')}
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
          {...register('description')}
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
          <div className="form-control">
            <Label className="label" htmlFor="technologies">
              <span className="label-text">Technologies</span>
            </Label>
            <div className="m-4 flex flex-1">
              {field.value.map((tech) => (
                <div key={tech}>
                  <Badge
                    onClick={() => {
                      field.onChange(field.value.filter((t) => t !== tech));
                    }}
                    className="hover:bg-primary cursor-pointer transition duration-200 ease-in-out hover:scale-105"
                    variant="outline">
                    {tech}
                  </Badge>
                </div>
              ))}
            </div>
            <div className="relative">
              <Input
                ref={techInputRef}
                type="text"
                className="input input-bordered w-full"
                placeholder="Add technology"
                onChange={(e) => handleTechSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const inputValue = e.currentTarget.value.trim();
                    if (!inputValue) return;
                    // Filter out suggestions that are already selected
                    const filteredSuggestions = suggestions.filter((tech) => !field.value.includes(tech));
                    // Use the first available suggestion from the filtered list.
                    const [closestMatch] = filteredSuggestions;
                    if (closestMatch !== undefined) {
                      field.onChange([...field.value, closestMatch]);
                      e.currentTarget.value = '';
                      setShowSuggestions(false);
                    }
                  }
                }}
                disabled={isSubmitting}
              />
              {showSuggestions && suggestions.length > 0 && (
                <div
                  ref={suggestionsRef}
                  className="bg-background absolute top-full left-0 z-10 mt-1 w-full rounded shadow-md">
                  {suggestions
                    .filter((tech) => !field.value.includes(tech))
                    .map((tech) => (
                      <Button
                        variant="outline"
                        key={tech}
                        type="button"
                        className="dropdown-item w-full px-4 py-2 text-left"
                        onClick={() => {
                          field.onChange([...field.value, tech]);
                          setShowSuggestions(false);
                          if (techInputRef.current) {
                            techInputRef.current.value = '';
                          }
                        }}
                        disabled={isSubmitting}>
                        <div className="dropdown-item-content">{tech}</div>
                      </Button>
                    ))}
                </div>
              )}
            </div>
            {errors.technologies && <span className="text-error text-sm">{errors.technologies.message}</span>}
          </div>
        )}
      />
      <div className="form-control">
        <Label className="label" htmlFor="githubRepo">
          <span className="label-text">GitHub Repository</span>
        </Label>
        <Input
          {...register('githubRepo')}
          className="input input-bordered w-full"
          placeholder="https://github.com/username/repo"
          disabled={isSubmitting}
        />
        {errors.githubRepo && <span className="text-error text-sm">{errors.githubRepo.message}</span>}
      </div>
      <Button
        type="submit"
        className="w-full cursor-pointer bg-green-600 hover:bg-green-600/80"
        disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : projectId ? 'Update Project' : 'Create Project'}
      </Button>
    </form>
  );
}
