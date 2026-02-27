// ============================================
// Color Picker Component
// ============================================
// Grid of preset colors for posts and categories

"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { COLOR_PALETTE } from "@/lib/constants";

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
  className?: string;
}

export default function ColorPicker({
  value,
  onChange,
  label,
  className,
}: ColorPickerProps) {
  return (
    <div className={className}>
      {/* Label */}
      {label && (
        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}

      {/* Color grid */}
      <div className="flex flex-wrap gap-2">
        {COLOR_PALETTE.map(({ name, value: colorValue }) => {
          const isSelected = value === colorValue;

          return (
            <button
              key={colorValue}
              type="button"
              title={name}
              onClick={() => onChange(colorValue)}
              className={cn(
                "relative flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200",
                "ring-offset-2 ring-offset-white dark:ring-offset-surface-800",
                isSelected
                  ? "ring-2 ring-slate-900 scale-110 dark:ring-white"
                  : "hover:scale-110 hover:ring-2 hover:ring-slate-300 dark:hover:ring-slate-600"
              )}
              style={{ backgroundColor: colorValue }}
            >
              {isSelected && (
                <Check
                  className="h-4 w-4 drop-shadow-sm"
                  style={{
                    color: isLightColor(colorValue) ? "#000000" : "#ffffff",
                  }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Helper: determine if a hex color is "light" for contrast
function isLightColor(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6;
}