import { useMemo, useState } from "react";
import { AceButton } from "@ace-ds/components/atoms/AceButton";
import { AceInputField } from "@ace-ds/components/atoms/AceInputField";
import { AceTabs } from "@ace-ds/components/atoms/AceTabs/AceTabs";
import {
  AceTooltip,
  AceTooltipContent,
  AceTooltipProvider,
  AceTooltipTrigger,
} from "@ace-ds/components/atoms/AceTooltip/AceTooltip";
import { MaterialSymbol } from "@ace-ds/components/molecules/AceAccordion/MaterialSymbol";
import {
  AceDropdownMenu,
  type AceDropdownMenuEntry,
} from "@ace-ds/components/molecules/AceDropdownMenu/AceDropdownMenu";
import { aceDropdownFieldLabelClass } from "@ace-ds/components/molecules/AceDropdownMenu/dropdownFieldStyles";
import { AceDatePicker } from "@ace-ds/components/organisms/AceDatePicker/AceDatePicker";
import {
  aceScrollableListHeaderClass,
  aceScrollableListMinimizedClass,
  aceScrollableListMinimizedTitleClass,
  aceScrollableListNotoVar,
  aceScrollableListShellClass,
  aceScrollableListShellMinimizedClass,
  aceScrollableListTitleClass,
} from "@ace-ds/components/organisms/AceScrollableList/scrollableListFieldStyles";
import { sidebarIconButtonClass } from "@ace-ds/components/organisms/AceSidebar/sidebarRowActions";
import emptySearchIllustration from "../../assets/kyc-client-search-empty-illust.png";
import { ThemeProvider } from "../context/ThemeContext";
import { aceDropShadowXsClass } from "../lib/aceShadow";
import { aceTypography, ACE_TYPE } from "../lib/aceTypography";
import { ReviewFlowSiteHeader } from "./ReviewFlowSiteHeader";
import { ScreeningResultsTable } from "./ScreeningResultsTable";
import { cn } from "./ui/utils";

const MODULE_TABS = ["Default", "Media", "Verify", "Validate"] as const;
const MODULE_TAB_ITEMS = MODULE_TABS.map((label) => ({ id: label, label }));
const RECORD_TYPE_OPTIONS = ["Any", "Individual", "Organization"] as const;
const SEARCH_TYPE_OPTIONS = [
  "Equal With Wildcarded Initials",
  "Exact Match",
  "Fuzzy Match",
  "Starts With",
] as const;
const APPLICATION_OPTIONS = [
  "Retail Banking",
  "Commercial Banking",
  "Wealth Management",
  "Treasury",
] as const;
const RISK_RATING_OPTIONS = ["Any", "Low", "Medium", "High"] as const;
const CITIZENSHIP_OPTIONS = [
  "United States",
  "United Kingdom",
  "Canada",
  "Germany",
  "France",
  "India",
  "China",
  "Brazil",
] as const;

const DEFAULT_FORM = {
  module: "Default" as (typeof MODULE_TABS)[number],
  recordType: "Any" as (typeof RECORD_TYPE_OPTIONS)[number],
  searchType: "Equal With Wildcarded Initials" as (typeof SEARCH_TYPE_OPTIONS)[number],
  applications: [] as string[],
  name: "",
  clientId: "",
  addressElements: "",
  clientRiskRating: "Any" as (typeof RISK_RATING_OPTIONS)[number],
  countryOfCitizenship: "" as string,
  dob: null as Date | null,
};

type SearchFormState = typeof DEFAULT_FORM;

function FieldSelect({
  label,
  value,
  placeholder,
  options,
  onChange,
  className,
}: {
  label: string;
  value: string;
  placeholder?: string;
  options: readonly string[];
  onChange: (value: string) => void;
  className?: string;
}) {
  const items = useMemo(
    (): AceDropdownMenuEntry[] =>
      options.map((option) => ({
        type: "item",
        label: option,
        highlighted: option === value,
        onSelect: () => onChange(option),
      })),
    [onChange, options, value],
  );

  const showPlaceholder = !value && Boolean(placeholder);

  return (
    <div className={cn("flex min-w-0 flex-col gap-1.5", className)}>
      <span className={aceDropdownFieldLabelClass}>{label}</span>
      <AceDropdownMenu
        triggerLabel={showPlaceholder ? placeholder! : value}
        triggerMode="field"
        size="md"
        panelWidth="wide"
        align="start"
        className={cn(
          "!w-full !max-w-none",
          showPlaceholder && "text-[var(--screening-text-muted)]",
        )}
        items={items}
      />
    </div>
  );
}

function ApplicationsSelect({
  selected,
  onChange,
}: {
  selected: readonly string[];
  onChange: (next: string[]) => void;
}) {
  const items = useMemo((): AceDropdownMenuEntry[] => {
    return APPLICATION_OPTIONS.map((option) => ({
      type: "checkbox" as const,
      label: option,
      checked: selected.includes(option),
      style: "assignment" as const,
      onCheckedChange: (checked: boolean) => {
        if (checked) onChange([...selected, option]);
        else onChange(selected.filter((item) => item !== option));
      },
    }));
  }, [onChange, selected]);

  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <span className={aceDropdownFieldLabelClass}>Applications</span>
      <AceDropdownMenu
        triggerLabel={`${selected.length} Selected`}
        triggerMode="field"
        size="md"
        panelWidth="wide"
        align="start"
        className="!w-full !max-w-none"
        items={items}
      />
    </div>
  );
}

function SectionHeading({ children }: { children: string }) {
  return (
    <div className="flex items-center gap-3 pt-1">
      <h3
        className={cn(
          aceTypography(ACE_TYPE.captionBold),
          "m-0 shrink-0 text-[var(--ace-button-purple-500)]",
        )}
      >
        {children}
      </h3>
      <div className="h-px min-w-0 flex-1 bg-[var(--screening-border-strong)]" aria-hidden />
    </div>
  );
}

function KycClientSearchForm({
  form,
  onChange,
  onReset,
  onSearch,
}: {
  form: SearchFormState;
  onChange: (patch: Partial<SearchFormState>) => void;
  onReset: () => void;
  onSearch: () => void;
}) {
  const [minimized, setMinimized] = useState(false);

  const canSearch =
    form.name.trim().length > 0 ||
    form.clientId.trim().length > 0 ||
    form.addressElements.trim().length > 0 ||
    form.applications.length > 0 ||
    form.countryOfCitizenship.length > 0 ||
    form.dob != null ||
    form.recordType !== "Any" ||
    form.clientRiskRating !== "Any" ||
    form.module !== "Default" ||
    form.searchType !== "Equal With Wildcarded Initials";

  return (
    <AceTooltipProvider>
      <div
        className={cn(
          aceScrollableListShellClass,
          "shrink-0",
          minimized
            ? aceScrollableListShellMinimizedClass
            : "w-[min(32rem,100%)]",
        )}
      >
        {minimized ? (
          <div className={aceScrollableListMinimizedClass}>
            <AceTooltip>
              <AceTooltipTrigger asChild>
                <button
                  type="button"
                  aria-expanded={false}
                  aria-label="Expand Search"
                  className={sidebarIconButtonClass}
                  onClick={() => setMinimized(false)}
                >
                  <MaterialSymbol
                    name="keyboard_arrow_right"
                    size="md"
                    className="text-current"
                  />
                </button>
              </AceTooltipTrigger>
              <AceTooltipContent side="right" variant="screening-toolbar" hideArrow>
                Expand
              </AceTooltipContent>
            </AceTooltip>
            <span
              className={aceScrollableListMinimizedTitleClass}
              style={{
                ...aceScrollableListNotoVar,
                writingMode: "vertical-rl",
                transform: "rotate(180deg)",
              }}
              title="Search"
            >
              Search
            </span>
          </div>
        ) : (
          <>
            <div className={aceScrollableListHeaderClass}>
              <p
                className={aceScrollableListTitleClass}
                style={aceScrollableListNotoVar}
              >
                Search
              </p>
              <AceTooltip>
                <AceTooltipTrigger asChild>
                  <button
                    type="button"
                    aria-expanded={true}
                    aria-label="Collapse Search"
                    className={cn(sidebarIconButtonClass, "shrink-0")}
                    onClick={() => setMinimized(true)}
                  >
                    <MaterialSymbol
                      name="keyboard_arrow_left"
                      size="md"
                      className="text-current"
                    />
                  </button>
                </AceTooltipTrigger>
                <AceTooltipContent side="top" variant="screening-toolbar" hideArrow>
                  Collapse
                </AceTooltipContent>
              </AceTooltip>
            </div>

            <div className="flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto px-4 pb-4">
              <div className="flex flex-col gap-4">
                <AceTabs
                  aria-label="Module"
                  items={MODULE_TAB_ITEMS}
                  value={form.module}
                  onValueChange={(module) =>
                    onChange({ module: module as SearchFormState["module"] })
                  }
                />

                <SectionHeading>Setup</SectionHeading>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <FieldSelect
                    label="Record Type"
                    value={form.recordType}
                    options={RECORD_TYPE_OPTIONS}
                    onChange={(recordType) =>
                      onChange({
                        recordType: recordType as SearchFormState["recordType"],
                      })
                    }
                  />
                  <FieldSelect
                    label="Search Type"
                    value={form.searchType}
                    options={SEARCH_TYPE_OPTIONS}
                    onChange={(searchType) =>
                      onChange({
                        searchType: searchType as SearchFormState["searchType"],
                      })
                    }
                  />
                </div>
                <ApplicationsSelect
                  selected={form.applications}
                  onChange={(applications) => onChange({ applications })}
                />

                <SectionHeading>Record Details</SectionHeading>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <AceInputField
                    label="Name"
                    fieldSize="md"
                    value={form.name}
                    onChange={(event) => onChange({ name: event.target.value })}
                  />
                  <AceInputField
                    label="Client ID"
                    fieldSize="md"
                    value={form.clientId}
                    onChange={(event) => onChange({ clientId: event.target.value })}
                  />
                </div>
                <div className="flex min-w-0 flex-col gap-1.5">
                  <span className={aceDropdownFieldLabelClass}>Address Elements</span>
                  <textarea
                    value={form.addressElements}
                    onChange={(event) =>
                      onChange({ addressElements: event.target.value })
                    }
                    rows={3}
                    className={cn(
                      "min-h-[4.5rem] w-full resize-y rounded-[var(--radius-sm)] border border-solid",
                      "border-[var(--screening-input-border)] bg-[var(--color-surface-primary)]",
                      "px-[var(--screening-input-px)] py-2",
                      "[font:var(--ace-type-paragraph-p1-regular)] [letter-spacing:var(--ace-type-paragraph-p1-regular-tracking)]",
                      "text-[var(--screening-text-primary)] outline-none",
                      "focus-visible:border-[var(--screening-input-border-focus)] focus-visible:bg-[var(--screening-input-bg-focus)]",
                      "focus-visible:ring-2 focus-visible:ring-[var(--screening-primary-ring)]",
                    )}
                  />
                </div>
                <FieldSelect
                  label="Client Risk Rating"
                  value={form.clientRiskRating}
                  options={RISK_RATING_OPTIONS}
                  onChange={(clientRiskRating) =>
                    onChange({
                      clientRiskRating:
                        clientRiskRating as SearchFormState["clientRiskRating"],
                    })
                  }
                />

                <SectionHeading>User Fields</SectionHeading>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <FieldSelect
                    label="Country of Citizenship"
                    value={form.countryOfCitizenship}
                    placeholder="Select"
                    options={CITIZENSHIP_OPTIONS}
                    onChange={(countryOfCitizenship) =>
                      onChange({ countryOfCitizenship })
                    }
                  />
                  <div
                    className="flex min-w-0 flex-col gap-1.5"
                    style={{ ["--ace-date-picker-trigger-width" as string]: "100%" }}
                  >
                    <AceDatePicker
                      mode="single"
                      label="DOB"
                      placeholder="dd mmm yyyy"
                      value={form.dob}
                      onChange={(dob) => onChange({ dob })}
                      className="w-full max-w-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex shrink-0 items-center justify-between gap-3 border-t border-[var(--screening-border-strong)] bg-[var(--screening-surface-muted)] px-4 py-3">
              <button
                type="button"
                aria-label="Search help"
                className={cn(
                  "inline-flex size-8 items-center justify-center rounded-full",
                  "text-[var(--ace-button-purple-500)] transition-colors",
                  "hover:bg-[var(--screening-primary-soft-bg)]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--screening-primary-ring)]",
                )}
              >
                <MaterialSymbol name="help" size="md" className="text-current" filled />
              </button>
              <div className="flex items-center gap-2">
                <AceButton type="button" variant="secondary" size="md" onClick={onReset}>
                  Reset
                </AceButton>
                <AceButton
                  type="button"
                  variant="primary"
                  size="md"
                  disabled={!canSearch}
                  onClick={onSearch}
                >
                  Search
                </AceButton>
              </div>
            </div>
          </>
        )}
      </div>
    </AceTooltipProvider>
  );
}

function KycClientSearchEmptyResults() {
  return (
    <div
      className={cn(
        "flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden",
        "rounded-[var(--radius-sm)] border border-solid border-[var(--screening-border-strong)]",
        "bg-[var(--screening-surface)]",
        aceDropShadowXsClass,
      )}
    >
      <div className="flex shrink-0 items-center px-5 py-4">
        <h2
          className={cn(
            aceTypography(ACE_TYPE.p1Regular),
            "m-0 text-sm text-[var(--screening-text-secondary)]",
          )}
        >
          Results
        </h2>
      </div>

      <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-6 overflow-x-auto px-10 pb-16 pt-4 text-center">
        <img
          src={emptySearchIllustration}
          alt=""
          width={420}
          height={178}
          className="h-auto w-[min(26rem,72%)] max-w-full select-none"
          draggable={false}
        />
        <div className="flex flex-col items-center gap-2">
          <h3
            className={cn(
              aceTypography(ACE_TYPE.h6Bold),
              "m-0 text-[1.125rem] leading-snug text-[var(--screening-text-primary)]",
            )}
          >
            Who are you looking for?
          </h3>
          <p
            className={cn(
              aceTypography(ACE_TYPE.p1Regular),
              "m-0 whitespace-nowrap text-sm leading-[1.65] text-[var(--screening-text-secondary)]",
            )}
          >
            Use the fields on the left to search clients in FinScan or you can add a client.
          </p>
        </div>
      </div>
    </div>
  );
}

export function KycClientSearchPage() {
  const [form, setForm] = useState<SearchFormState>(() => ({ ...DEFAULT_FORM }));
  const [hasSearched, setHasSearched] = useState(false);

  const patchForm = (patch: Partial<SearchFormState>) => {
    setForm((prev) => ({ ...prev, ...patch }));
  };

  const handleReset = () => {
    setForm({ ...DEFAULT_FORM, applications: [] });
    setHasSearched(false);
  };

  const handleSearch = () => {
    setHasSearched(true);
  };

  return (
    <ThemeProvider>
      <div className="flex h-screen w-screen flex-col overflow-hidden bg-[var(--screening-surface-muted)] text-[var(--screening-text-primary)]">
        <ReviewFlowSiteHeader activeProduct="kyc" />

        <div className="flex shrink-0 items-center justify-between gap-4 border-b border-[var(--screening-border-strong)] bg-[var(--screening-surface)] px-4 py-3 md:px-8">
          <h1
            className={cn(
              aceTypography(ACE_TYPE.h6Bold),
              "m-0 text-base leading-[1.65] text-[var(--screening-text-primary)]",
            )}
          >
            Client Search
          </h1>
          <div
            className={cn(
              "inline-flex shrink-0 items-center justify-center border border-[var(--screening-border-strong)] bg-[var(--screening-surface)] px-3 py-1.5",
              aceTypography(ACE_TYPE.captionBold),
              "text-[var(--screening-text-secondary)]",
            )}
            aria-label="Organization"
          >
            AIG
          </div>
        </div>

        <div className="flex min-h-0 flex-1 overflow-hidden px-4 pb-4 pt-4">
          <div className="flex min-h-0 flex-1 gap-4 overflow-hidden">
            <KycClientSearchForm
              form={form}
              onChange={patchForm}
              onReset={handleReset}
              onSearch={handleSearch}
            />

            {hasSearched ? (
              <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
                <ScreeningResultsTable
                  rows={[]}
                  title="Search Results"
                  className="min-h-0 flex-1"
                  readOnly
                />
              </div>
            ) : (
              <KycClientSearchEmptyResults />
            )}
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}
