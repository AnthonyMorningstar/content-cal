// ============================================
// Board Filters Component
// ============================================
// Filter controls for the Kanban board —
// content type, category, and search

"use client";

import { useState } from "react";
import { Search, X, SlidersHorizontal } from "lucide-react";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { CONTENT_TYPE_CONFIG } from "@/lib/constants";

const typeFilterOptions = [
  { value: "", label: "All Types" },
  ...Object.entries(CONTENT_TYPE_CONFIG).map(([value, config]) => ({
    value,
    label: `${config.icon} ${config.label}`,
  })),
];

interface BoardFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  typeFilter: string;
  onTypeFilterChange: (type: string) => void;
  totalCount: number;
  filteredCount: number;
}

export default function BoardFilters({
  searchQuery,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  totalCount,
  filteredCount,
}: BoardFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);

  const hasActiveFilters = searchQuery || typeFilter;
  const isFiltered = filteredCount !== totalCount;

  const clearAll = () => {
    onSearchChange("");
    onTypeFilterChange("");
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search posts on board..."
            className="input-field pl-10 pr-10"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filter toggle */}
        <div className="flex items-center gap-2">
          <Button
            variant={showFilters ? "secondary" : "outline"}
            size="md"
            onClick={() => setShowFilters(!showFilters)}
            leftIcon={<SlidersHorizontal className="h-4 w-4" />}
          >
            Filters
            {hasActiveFilters && (
              <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 text-[10px] text-white">
                !
              </span>
            )}
          </Button>

          {/* Filtered count */}
          {isFiltered && (
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {filteredCount} of {totalCount}
            </span>
          )}
        </div>
      </div>

      {/* Filter dropdowns */}
      {showFilters && (
        <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 dark:border-surface-700 dark:bg-surface-800 sm:flex-row sm:items-end">
          <div className="flex-1">
            <Select
              label="Content Type"
              value={typeFilter}
              onChange={(e) => onTypeFilterChange(e.target.value)}
              options={typeFilterOptions}
            />
          </div>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="md"
              onClick={clearAll}
              leftIcon={<X className="h-4 w-4" />}
            >
              Clear All
            </Button>
          )}
        </div>
      )}
    </div>
  );
}