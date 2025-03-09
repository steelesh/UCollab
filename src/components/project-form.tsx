'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect, useRef } from 'react';
import { createProject, updateProject, searchTechnologies } from '~/features/projects/project.actions';
import { CreateProjectInput, projectSchema } from '~/features/projects/project.schema';
import { PostType, Project } from '@prisma/client';

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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="form-control">
        <label className="label" htmlFor="title">
          <span className="label-text">Project Title</span>
        </label>
        <input
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
        <textarea
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
            <label className="label" htmlFor="technologies">
              <span className="label-text">Technologies</span>
            </label>
            <div className="mb-2 flex flex-wrap gap-2">
              {field.value.map((tech) => (
                <div key={tech} className="badge gap-2">
                  {tech}
                  <button
                    type="button"
                    onClick={() => {
                      field.onChange(field.value.filter((t) => t !== tech));
                    }}
                    className="btn btn-xs btn-ghost"
                    disabled={isSubmitting}>
                    ×
                  </button>
                </div>
              ))}
            </div>
            <div className="relative">
              <input
                ref={techInputRef}
                type="text"
                className="input input-bordered w-full"
                placeholder="Add technology"
                onChange={(e) => handleTechSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const value = e.currentTarget.value.trim().toLowerCase();
                    if (value && !field.value.includes(value)) {
                      field.onChange([...field.value, value]);
                      e.currentTarget.value = '';
                      setShowSuggestions(false);
                    }
                  }
                }}
                disabled={isSubmitting}
              />
              {showSuggestions && suggestions.length > 0 && (
                <div ref={suggestionsRef} className="dropdown-container">
                  {suggestions.map((tech) => (
                    <button
                      key={tech}
                      type="button"
                      className="dropdown-item"
                      onClick={() => {
                        field.onChange([...field.value, tech]);
                        setShowSuggestions(false);
                        if (techInputRef.current) {
                          techInputRef.current.value = '';
                        }
                      }}
                      disabled={isSubmitting}>
                      <div className="dropdown-item-content">{tech}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            {errors.technologies && <span className="text-error text-sm">{errors.technologies.message}</span>}
          </div>
        )}
      />
      <div className="form-control">
        <label className="label" htmlFor="githubRepo">
          <span className="label-text">GitHub Repository</span>
        </label>
        <input
          {...register('githubRepo')}
          className="input input-bordered w-full"
          placeholder="https://github.com/username/repo"
          disabled={isSubmitting}
        />
        {errors.githubRepo && <span className="text-error text-sm">{errors.githubRepo.message}</span>}
      </div>
      <Controller
        control={control}
        name="postType"
        render={({ field }) => (
          <div className="flex gap-4">
            {Object.values(PostType).map((type) => (
              <div key={type} className="flex items-center">
                <input
                  type="radio"
                  id={type}
                  value={type}
                  checked={field.value === type}
                  onChange={() => field.onChange(type)}
                  className="peer hidden"
                  disabled={isSubmitting}
                />
                <label
                  htmlFor={type}
                  className="btn btn-outline btn-xs btn-accent peer-checked:bg-primary-content rounded-lg peer-checked:text-white">
                  {type.charAt(0) + type.slice(1).toLowerCase()}
                </label>
              </div>
            ))}
          </div>
        )}
      />
      <button type="submit" className="btn w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : projectId ? 'Update Project' : 'Create Project'}
      </button>
    </form>
  );
}
