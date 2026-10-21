import { useCallback, useMemo, useState } from "react";
import { AceAccordion } from "@ace-ds/components/molecules/AceAccordion/AceAccordion";
import { MaterialSymbol } from "@ace-ds/components/molecules/AceAccordion/MaterialSymbol";
import { ThemeProvider } from "../context/ThemeContext";
import { useUserFlow } from "../flows/FlowContext";
import { aceTypography, ACE_TYPE } from "../lib/aceTypography";
import { ExpandableFinScanTable } from "./ExpandableFinScanTable";
import { ReviewFlowSiteHeader } from "./ReviewFlowSiteHeader";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { cn } from "./ui/utils";

type CaseBrowserRow = { id: string };

/** Bare placeholder rows so selection chrome can be exercised before columns are defined. */
const PLACEHOLDER_ROWS: CaseBrowserRow[] = Array.from({ length: 15 }, (_, index) => ({
  id: `case-browser-row-${index + 1}`,
}));

export function CaseBrowserPage() {
  const { openReviewAssigned } = useUserFlow();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());
  const [fabOpen, setFabOpen] = useState(false);

  const selectedCount = selectedIds.size;
  const showSelectionBar = selectedCount > 0;
  const allSelected = selectedCount === PLACEHOLDER_ROWS.length;

  const headerCheckboxState = useMemo((): boolean | "indeterminate" => {
    if (selectedCount === 0) return false;
    if (selectedCount === PLACEHOLDER_ROWS.length) return true;
    return "indeterminate";
  }, [selectedCount]);

  const toggleRow = useCallback((id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  }, []);

  const onHeaderSelectAll = useCallback((value: boolean | "indeterminate") => {
    if (value === true) {
      setSelectedIds(new Set(PLACEHOLDER_ROWS.map((row) => row.id)));
      return;
    }
    setSelectedIds(new Set());
  }, []);

  const selectAll = useCallback(() => {
    setSelectedIds(new Set(PLACEHOLDER_ROWS.map((row) => row.id)));
  }, []);

  const deselectAll = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const handleReview = useCallback(() => {
    setFabOpen(false);
    openReviewAssigned();
  }, [openReviewAssigned]);

  return (
    <ThemeProvider>
      <div className="relative flex h-screen w-screen flex-col overflow-hidden bg-[var(--screening-surface-muted)] text-[var(--screening-text-primary)]">
        <ReviewFlowSiteHeader activeProduct="watchlist" />

        <div className="flex shrink-0 items-center justify-between gap-4 border-b border-[var(--screening-border-strong)] bg-[var(--screening-surface)] px-4 py-3 md:px-8">
          <h1
            className={cn(
              aceTypography(ACE_TYPE.h6Bold),
              "m-0 text-base leading-[1.65] text-[var(--screening-text-primary)]",
            )}
          >
            Case Browser
          </h1>
          <span aria-hidden>
            <MaterialSymbol
              name="bar_chart"
              size="md"
              className="text-[var(--screening-text-secondary)]"
            />
          </span>
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-4 pb-4 pt-4 md:px-8">
          <AceAccordion
            title="Data Table"
            defaultOpen
            surface="white"
            contentPadding={false}
            showChevron={false}
            showTag={false}
            showAddIcon={false}
            showDeleteIcon={false}
            showEditIcon={false}
            showMoreIcon={false}
            className="flex min-h-0 flex-1 flex-col overflow-hidden"
          >
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[var(--screening-surface)]">
              <ExpandableFinScanTable
                rows={PLACEHOLDER_ROWS}
                columns={[
                  {
                    key: "placeholder",
                    label: "",
                    colClassName: "w-full",
                    render: () => null,
                  },
                ]}
                caption="Case browser results"
                expandable={false}
                showExpandAll={false}
                scrollX={false}
                minWidth="min-w-0"
                tableLayout="fixed"
                className="min-h-0 flex-1"
                selectionCellClassName="pl-[var(--ace-accordion-px)] pr-0"
                selection={{
                  selectedIds,
                  isSelectable: () => true,
                  onToggleRow: toggleRow,
                  onHeaderSelectAll,
                  headerCheckboxState,
                  actionableCount: PLACEHOLDER_ROWS.length,
                }}
              />
            </div>
          </AceAccordion>
        </div>

        {showSelectionBar ? (
          <div
            role="toolbar"
            aria-label="Case selection actions"
            className={cn(
              "pointer-events-auto absolute bottom-6 left-1/2 z-30 flex w-[min(60rem,calc(100%-8.5rem))] -translate-x-1/2",
              "items-center justify-between gap-4 rounded-[var(--radius-md)] px-4 py-3",
              "bg-[var(--ace-button-purple-500)] text-white",
              "shadow-[var(--ace-drop-shadow-xl)]",
            )}
          >
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <span
                className={cn(
                  aceTypography(ACE_TYPE.p1SemiBold),
                  "whitespace-nowrap px-1 text-sm text-white",
                )}
              >
                {selectedCount} Selected
              </span>
              <button
                type="button"
                onClick={selectAll}
                disabled={allSelected}
                aria-disabled={allSelected}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] border-0 bg-transparent px-3 py-2",
                  "text-sm text-white transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70",
                  aceTypography(ACE_TYPE.p1Regular),
                  allSelected
                    ? "cursor-not-allowed opacity-50"
                    : "hover:bg-[var(--ace-button-purple-400)]",
                )}
              >
                <MaterialSymbol name="ads_click" size="sm" className="text-current" />
                Select all
              </button>
              <span className="mx-1 h-4 w-px shrink-0 bg-white/35" aria-hidden />
              <button
                type="button"
                onClick={deselectAll}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] border-0 bg-transparent px-3 py-2",
                  "text-sm text-white transition-colors hover:bg-[var(--ace-button-purple-400)]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70",
                  aceTypography(ACE_TYPE.p1Regular),
                )}
              >
                <MaterialSymbol name="indeterminate_check_box" size="sm" className="text-current" />
                {selectedCount === 1 ? "Deselect" : "Deselect all"}
              </button>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={handleReview}
                className={cn(
                  "inline-flex items-center gap-2 rounded-[var(--radius-sm)] border-0 bg-transparent px-3 py-2",
                  "text-sm text-white transition-colors hover:bg-[var(--ace-button-purple-400)]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70",
                  aceTypography(ACE_TYPE.p1SemiBold),
                )}
              >
                <MaterialSymbol name="person_add" size="sm" className="text-current" />
                Review
              </button>
              <button
                type="button"
                aria-label="Dismiss selection bar"
                onClick={deselectAll}
                className={cn(
                  "inline-flex size-8 items-center justify-center rounded-[var(--radius-sm)] border-0 bg-transparent",
                  "text-white transition-colors hover:bg-[var(--ace-button-purple-400)]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70",
                )}
              >
                <MaterialSymbol name="close" size="md" className="text-current" />
              </button>
            </div>
          </div>
        ) : null}

        <DropdownMenu open={fabOpen} onOpenChange={setFabOpen} modal={false}>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label={fabOpen ? "Close actions menu" : "Open actions menu"}
              aria-expanded={fabOpen}
              className={cn(
                "fixed bottom-6 right-6 z-30 inline-flex size-12 items-center justify-center rounded-[var(--radius-md)]",
                "bg-[var(--ace-button-purple-400)] text-white shadow-[var(--ace-landing-page-card-shadow-hover)]",
                "dark:bg-[var(--ace-button-purple-500)]",
                "transition-[transform,box-shadow] duration-[var(--ace-motion-duration-medium)]",
                "[transition-timing-function:var(--ace-motion-ease-standard)]",
                "motion-reduce:transition-none",
                "hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--screening-primary-ring)] focus-visible:ring-offset-2",
                fabOpen && "scale-105 shadow-[var(--ace-drop-shadow-xl)]",
              )}
            >
              <span className="relative inline-flex size-7 items-center justify-center">
                <MaterialSymbol
                  name="format_list_bulleted"
                  size="lg"
                  className={cn(
                    "absolute transition-[opacity,transform] duration-[var(--ace-motion-duration-medium)]",
                    "[transition-timing-function:var(--ace-motion-ease-standard)] motion-reduce:transition-none",
                    fabOpen
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
                    fabOpen
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
            className={cn(
              "min-w-[10rem] origin-bottom-right p-2",
              "data-[state=open]:animate-in data-[state=closed]:animate-out",
              "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
              "data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95",
              "data-[state=open]:slide-in-from-bottom-3 data-[state=closed]:slide-out-to-bottom-2",
              "duration-[var(--ace-motion-duration-medium)]",
              "[animation-timing-function:var(--ace-motion-ease-standard)]",
              "motion-reduce:animate-none",
            )}
          >
            <DropdownMenuItem
              className={cn(
                "cursor-pointer",
                "animate-in fade-in-0 slide-in-from-bottom-1",
                "duration-[var(--ace-motion-duration-medium)]",
                "[animation-timing-function:var(--ace-motion-ease-standard)]",
                "motion-reduce:animate-none",
              )}
              style={{ animationDelay: "40ms", animationFillMode: "both" }}
              onSelect={handleReview}
            >
              Review{selectedCount > 0 ? ` (${selectedCount})` : ""}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className={cn(
                "cursor-pointer",
                "animate-in fade-in-0 slide-in-from-bottom-1",
                "duration-[var(--ace-motion-duration-medium)]",
                "[animation-timing-function:var(--ace-motion-ease-standard)]",
                "motion-reduce:animate-none",
              )}
              style={{ animationDelay: "90ms", animationFillMode: "both" }}
            >
              Online Help
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </ThemeProvider>
  );
}
