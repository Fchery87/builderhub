"use client";

import { Sun, Moon, Laptop } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/use-theme";

const themeOptions = [
  {
    value: "light",
    label: "Light",
    icon: <Sun className="h-4 w-4 text-amber-500" />,
  },
  {
    value: "dark",
    label: "Dark",
    icon: <Moon className="h-4 w-4 text-cyan-400" />,
  },
  {
    value: "system",
    label: "System",
    icon: <Laptop className="h-4 w-4 text-slate-500" />,
  },
];

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="ring-1 ring-inset ring-slate-200 dark:ring-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Toggle theme"
        >
          {resolvedTheme === "dark" ? (
            <Moon className="h-4 w-4 text-cyan-400" />
          ) : (
            <Sun className="h-4 w-4 text-amber-500" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {themeOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            className={cn(
              "flex items-center gap-2 text-sm font-medium",
              theme === option.value ? "text-primary" : "text-muted-foreground"
            )}
            onClick={() => setTheme(option.value as "light" | "dark" | "system")}
          >
            {option.icon}
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
