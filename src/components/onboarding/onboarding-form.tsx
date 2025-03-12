'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateOnboarding, searchTechnologies } from '~/features/users/user.actions';
import { onboardingSchema } from '~/features/users/user.schema';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Badge } from '~/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group';

export interface OnboardingInput {
  gradYear: string;
  technologies: string[];
  githubProfile: string;
  mentorshipStatus: 'MENTOR' | 'MENTEE' | 'NONE';
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
      gradYear: '',
      technologies: [],
      githubProfile: '',
      mentorshipStatus: 'NONE',
    },
  });

  // Watch the technologies field
  const technologies = watch('technologies');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Close suggestions if clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch suggestions when user types
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

  const onSubmit = async (data: OnboardingInput) => {
    const formData = new FormData();
    formData.append('gradYear', data.gradYear);
    formData.append('technologies', JSON.stringify(data.technologies));
    formData.append('githubProfile', data.githubProfile);
    formData.append('projectType', data.mentorshipStatus);
    formData.append('mentorshipStatus', data.mentorshipStatus || 'NONE');
    try {
      await updateOnboarding(formData);
    } catch (error) {
      console.error('Error updating onboarding:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 rounded-lg border p-8">
      <div className="form-control">
        <Label htmlFor="gradYear" className="label">
          <span className="label-text">Graduation Year</span>
        </Label>
        <Input
          id="gradYear"
          placeholder="2025"
          {...register('gradYear')}
          className="input input-bordered w-full"
          disabled={isSubmitting}
        />
        {errors.gradYear && <span className="text-error text-sm">{errors.gradYear.message}</span>}
      </div>
      <div className="form-control relative">
        <Controller
          control={control}
          name="technologies"
          render={({ field }) => (
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
                    variant="outline">
                    {tech}
                  </Badge>
                ))}
              </div>
              <Input
                ref={inputRef}
                type="text"
                className="input input-bordered w-full"
                placeholder="Add technology"
                onChange={(e) => handleTechSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const inputValue = e.currentTarget.value.trim();
                    if (!inputValue) return;
                    const filteredSuggestions = suggestions.filter((tech) => !field.value.includes(tech));
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
                  {suggestions.map((tech) => (
                    <Button
                      key={tech}
                      type="button"
                      variant="outline"
                      className="w-full px-4 py-2 text-left"
                      onClick={() => {
                        field.onChange([...field.value, tech]);
                        setShowSuggestions(false);
                      }}
                      disabled={isSubmitting}>
                      {tech}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          )}
        />
        {errors.technologies && <span className="text-error text-sm">{errors.technologies.message}</span>}
      </div>
      <div className="form-control">
        <Label className="label" htmlFor="githubRepo">
          <span className="label-text">GitHub Repository</span>
        </Label>
        <Input
          {...register('githubProfile')}
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
            <RadioGroup value={value ?? 'NONE'} onValueChange={onChange}>
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
        disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Submit'}
      </Button>
    </form>
  );
}
