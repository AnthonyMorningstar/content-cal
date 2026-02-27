// ============================================
// Avatar Component
// ============================================
// User avatar with image, initials fallback,
// and online status indicator

import Image from "next/image";
import { cn, getInitials } from "@/lib/utils";

const sizeMap = {
  xs: "h-6 w-6 text-[10px]",
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-16 w-16 text-lg",
  "2xl": "h-20 w-20 text-xl",
};

interface AvatarProps {
  src?: string | null;
  name?: string | null;
  size?: keyof typeof sizeMap;
  showStatus?: boolean;
  isOnline?: boolean;
  className?: string;
}

export default function Avatar({
  src,
  name,
  size = "md",
  showStatus = false,
  isOnline = false,
  className,
}: AvatarProps) {
  const initials = getInitials(name);

  return (
    <div className={cn("relative inline-flex shrink-0", className)}>
      <div
        className={cn(
          "relative overflow-hidden rounded-full bg-brand-100 dark:bg-brand-900/40",
          sizeMap[size]
        )}
      >
        {src ? (
          <Image
            src={src}
            alt={name || "User avatar"}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-semibold text-brand-700 dark:text-brand-300">
            {initials}
          </div>
        )}
      </div>

      {/* Online status dot */}
      {showStatus && (
        <span
          className={cn(
            "absolute bottom-0 right-0 block rounded-full ring-2 ring-white dark:ring-surface-800",
            size === "xs" || size === "sm" ? "h-2 w-2" : "h-3 w-3",
            isOnline ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600"
          )}
        />
      )}
    </div>
  );
}