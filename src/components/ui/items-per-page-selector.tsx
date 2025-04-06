"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";

type ItemsPerPageSelectorProps = {
  readonly currentLimit: number;
  readonly options: number[];
  readonly totalCount: number;
  readonly startIndex: number;
  readonly endIndex: number;
  readonly basePath: string;
  readonly itemName: string;
  readonly onValueChange?: (value: string) => void;
};

export function ItemsPerPageSelector({
  currentLimit,
  options,
  totalCount,
  startIndex,
  endIndex,
  basePath = "/p",
  itemName = "posts",
  onValueChange,
}: ItemsPerPageSelectorProps) {
  return (
    <div className="flex items-center space-x-3">
      <span className="text-sm">
        {itemName.charAt(0).toUpperCase() + itemName.slice(1)}
        {" "}
        per page
      </span>
      <Select
        defaultValue={currentLimit.toString()}
        onValueChange={(value) => {
          if (onValueChange) {
            onValueChange(value);
          } else {
            window.location.href = `${basePath}?page=1&limit=${value}`;
          }
        }}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map(option => (
            <SelectItem key={option} value={option.toString()}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <span className="text-sm">
        {startIndex}
        –
        {endIndex}
        {" "}
        of
        {" "}
        {totalCount}
        {" "}
        {itemName}
      </span>
    </div>
  );
}
