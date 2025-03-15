'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';

interface ItemsPerPageSelectorProps {
  currentLimit: number;
  options: number[];
  totalCount: number;
  startIndex: number;
  endIndex: number;
}

export function ItemsPerPageSelector({
  currentLimit,
  options,
  totalCount,
  startIndex,
  endIndex,
}: ItemsPerPageSelectorProps) {
  return (
    <div className="flex items-center space-x-3">
      <span className="text-sm">Projects per page</span>
      <Select
        defaultValue={currentLimit.toString()}
        onValueChange={(value) => {
          window.location.href = `/p?page=1&limit=${value}`;
        }}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option.toString()}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <span className="text-sm">
        {startIndex}–{endIndex} of {totalCount} projects
      </span>
    </div>
  );
}
