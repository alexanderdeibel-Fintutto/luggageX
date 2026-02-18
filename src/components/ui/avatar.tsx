import * as React from "react";
import { cn, getInitials } from "@/lib/utils";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  src?: string | null;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-lg",
};

function Avatar({ name, src, size = "md", className, ...props }: AvatarProps) {
  if (src) {
    return (
      <div className={cn("relative overflow-hidden rounded-full", sizeClasses[size], className)} {...props}>
        <img src={src} alt={name} className="h-full w-full object-cover" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full bg-primary/10 text-primary font-semibold",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {getInitials(name)}
    </div>
  );
}

export { Avatar };
