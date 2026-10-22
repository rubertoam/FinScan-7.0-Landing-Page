import { useState } from "react";
import { MaterialSymbol } from "@ace-ds/components/molecules/AceAccordion/MaterialSymbol";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { cn } from "./ui/utils";

const fabMenuItemClass = cn(
  "cursor-pointer",
  "animate-in fade-in-0 slide-in-from-bottom-1",
  "duration-[var(--ace-motion-duration-medium)]",
  "[animation-timing-function:var(--ace-motion-ease-standard)]",
  "motion-reduce:animate-none",
);

const fabContentClass = cn(
  "min-w-[10rem] origin-bottom-right p-2",
  "data-[state=open]:animate-in data-[state=closed]:animate-out",
  "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
  "data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95",
  "data-[state=open]:slide-in-from-bottom-3 data-[state=closed]:slide-out-to-bottom-2",
  "duration-[var(--ace-motion-duration-medium)]",
  "[animation-timing-function:var(--ace-motion-ease-standard)]",
  "motion-reduce:animate-none",
);

/** Case Browser Version A help FAB — online-help menu placeholder for site-wide use. */
export function OnlineHelpFab({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen} modal={false}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open online help"}
          aria-expanded={open}
          className={cn(
            "fixed bottom-6 right-6 z-30 inline-flex size-12 items-center justify-center rounded-[var(--radius-md)]",
            "bg-[var(--ace-button-purple-400)] text-white shadow-[var(--ace-landing-page-card-shadow-hover)]",
            "dark:bg-[var(--ace-button-purple-500)]",
            "transition-[transform,box-shadow] duration-[var(--ace-motion-duration-medium)]",
            "[transition-timing-function:var(--ace-motion-ease-standard)]",
            "motion-reduce:transition-none",
            "hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--screening-primary-ring)] focus-visible:ring-offset-2",
            open && "scale-105 shadow-[var(--ace-drop-shadow-xl)]",
            className,
          )}
        >
          <span className="relative inline-flex size-7 items-center justify-center">
            <MaterialSymbol
              name="help"
              size="lg"
              className={cn(
                "absolute transition-[opacity,transform] duration-[var(--ace-motion-duration-medium)]",
                "[transition-timing-function:var(--ace-motion-ease-standard)] motion-reduce:transition-none",
                open
                  ? "pointer-events-none scale-75 rotate-90 opacity-0"
                  : "scale-100 rotate-0 opacity-100",
              )}
            />
            <MaterialSymbol
              name="close"
              size="lg"
              className={cn(
                "absolute transition-[opacity,transform] duration-[var(--ace-motion-duration-medium)]",
                "[transition-timing-function:var(--ace-motion-ease-standard)] motion-reduce:transition-none",
                open
                  ? "scale-100 rotate-0 opacity-100"
                  : "pointer-events-none scale-75 -rotate-90 opacity-0",
              )}
            />
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="top"
        align="end"
        sideOffset={12}
        className={fabContentClass}
      >
        <DropdownMenuItem
          className={fabMenuItemClass}
          style={{ animationDelay: "40ms", animationFillMode: "both" }}
        >
          Online Help
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
