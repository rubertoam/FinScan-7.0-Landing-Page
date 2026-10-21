import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import type { FinScanProfileAvatar } from "@ace-ds/lib/finscanProfileAvatars";
import { AceSiteHeader } from "@ace-ds/components/organisms/AceSiteHeader/AceSiteHeader";
import { MaterialSymbol } from "@ace-ds/components/molecules/AceAccordion/MaterialSymbol";
import { aceChevronIconClass } from "@ace-ds/lib/aceChevron";
import { useTheme } from "../context/ThemeContext";
import { useUserFlow } from "../flows/FlowContext";
import { getProfileForUserFlow } from "../lib/profileAssets";
import { aceDropShadowXsClass } from "../lib/aceShadow";
import { aceIconButtonHoverClass } from "../lib/aceIconButton";
import { aceTypography, ACE_TYPE } from "../lib/aceTypography";
import { cn } from "./ui/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuToggleItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const captionBold =
  "[font:var(--ace-type-caption-bold)] [letter-spacing:var(--ace-type-caption-bold-tracking)]";
const p1 =
  "[font:var(--ace-type-paragraph-p1-regular)] [letter-spacing:var(--ace-type-paragraph-p1-regular-tracking)]";
const motionEase = "[transition-timing-function:var(--ace-motion-ease-standard)]";

export type ProductNavId = "watchlist" | "payments" | "kyc" | "reporting";

const PRODUCT_NAV: readonly {
  id: ProductNavId;
  label: string;
  accent: string;
}[] = [
  { id: "watchlist", label: "Watchlist", accent: "var(--ace-button-purple-500)" },
  { id: "payments", label: "Payments", accent: "var(--ace-secondary-enlighten-violet-500)" },
  { id: "kyc", label: "KYC", accent: "var(--ace-finscan-mark-blue)" },
  { id: "reporting", label: "Reporting", accent: "var(--ace-secondary-teal-500)" },
];

const WATCHLIST_FEATURE_ITEMS = [
  "Assigned Cases",
  "Case Browser",
  "Name/Address List Search",
  "Specific Element List Search",
  "QuickScan",
  "Search Audit Logs",
  "User Defined List Editor",
  "Match Simulation",
] as const;

const PAYMENTS_FEATURE_ITEMS = [
  "Assigned Transactions",
  "Payments Browser",
  "Safe List Search",
  "Payments Management",
] as const;

const KYC_FEATURE_ITEMS = [
  "Client Search",
  "Media Search",
  "Verify Search",
  "Validate Search",
  "Add Client",
  "Upload Client File",
] as const;

const REPORTING_FEATURE_ITEMS = [
  "Dashboard",
  "Report Library",
  "Data Manager",
] as const;

const SECTION_ITEMS = ["Reports", "Dashboards"] as const;

const navSplitShellClass = cn(
  "group/nav relative inline-flex h-full min-h-[2.5rem] items-stretch rounded-[var(--radius-sm)]",
  "transition-colors duration-[var(--ace-motion-duration-fast)]",
  motionEase,
  // Shared hover across label + chevron
  "hover:bg-[var(--ace-site-header-nav-hover)]",
  "has-[[data-state=open]]:bg-[var(--ace-site-header-nav-hover)]",
);

const navLabelButtonClass = cn(
  p1,
  "inline-flex items-center rounded-l-[var(--radius-sm)] bg-transparent px-3 py-3 text-sm text-[var(--screening-text-primary)]",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--screening-primary-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--screening-primary-ring-offset)]",
);

const navMenuButtonClass = cn(
  "inline-flex items-center self-stretch rounded-r-[var(--radius-sm)] bg-transparent px-1.5 py-3",
  "border-l border-transparent text-[var(--screening-text-primary)]",
  "transition-[border-color] duration-[var(--ace-motion-duration-fast)]",
  motionEase,
  // Gray divider between label and chevron on shared hover / open
  "group-hover/nav:border-[var(--screening-border-row)]",
  "data-[state=open]:border-[var(--screening-border-row)]",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--screening-primary-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--screening-primary-ring-offset)]",
);

const profileTriggerClass = cn(
  "inline-flex shrink-0 cursor-pointer rounded-full p-1 transition-colors duration-[var(--ace-motion-duration-fast)]",
  motionEase,
  "hover:bg-[var(--ace-site-header-nav-hover)]",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--screening-primary-ring)]",
  "data-[state=open]:bg-[var(--ace-site-header-nav-hover)]",
);

const menuItemClass = cn(
  "cursor-pointer rounded-[var(--radius-sm)] px-3 py-2",
  "text-[var(--screening-text-primary)]",
  "data-[highlighted]:bg-[var(--ace-dropdown-menu-row-hover)]",
);

const menuSelectedClass = cn(
  menuItemClass,
  "bg-[var(--screening-primary-soft-bg)] data-[highlighted]:bg-[var(--screening-primary-soft-bg)]",
);

const dashedSeparatorClass =
  "my-2 h-0 bg-transparent border-t border-dashed border-[var(--screening-border-row)]";

function ToolbarIconButton({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <button type="button" aria-label={label} className={aceIconButtonHoverClass}>
      {children}
    </button>
  );
}

const SETTINGS_MENU_ITEMS = [
  "Organization",
  "Payments Management",
  "Administration",
  "Screening Settings",
  "Focus Health",
  "Database Connections",
  "Common Configurations",
  "Batch Job Settings",
  "Risk Score Evaluator",
  "KYC Configurations",
  "Enhance Discover Configurations",
  "MTV Settings, Rules, Processes",
] as const;

function SettingsMenuDropdown() {
  const {
    appView,
    openAllSettings,
    openOrganizationSettings,
    openPaymentsManagement,
    openAdministrationSettings,
  } = useUserFlow();
  const onAllSettings = appView === "all-settings";
  const onOrganization = appView === "organization-settings";
  const onPaymentsManagement = appView === "payments-management";
  const onAdministration = appView === "administration-settings";

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button type="button" aria-label="Settings" className={aceIconButtonHoverClass}>
          <MaterialSymbol
            name="tune"
            size="xl"
            className="text-[var(--ace-site-header-toolbar-icon-color)]"
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={4}
        className="min-w-[16.5rem] max-w-[20rem] p-1"
      >
        <DropdownMenuItem
          className={cn(
            menuItemClass,
            onAllSettings &&
              "bg-[var(--screening-primary-soft-bg)] text-[var(--ace-button-purple-500)] data-[highlighted]:bg-[var(--screening-primary-soft-bg)] data-[highlighted]:text-[var(--ace-button-purple-500)]",
          )}
          onSelect={() => openAllSettings()}
        >
          All Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator className={dashedSeparatorClass} />
        {SETTINGS_MENU_ITEMS.map((item) => (
          <DropdownMenuItem
            key={item}
            className={cn(
              menuItemClass,
              ((item === "Organization" && onOrganization) ||
                (item === "Payments Management" && onPaymentsManagement) ||
                (item === "Administration" && onAdministration)) &&
                "bg-[var(--screening-primary-soft-bg)] text-[var(--ace-button-purple-500)] data-[highlighted]:bg-[var(--screening-primary-soft-bg)] data-[highlighted]:text-[var(--ace-button-purple-500)]",
            )}
            onSelect={() => {
              if (item === "Organization") openOrganizationSettings();
              if (item === "Payments Management") openPaymentsManagement();
              if (item === "Administration") openAdministrationSettings();
            }}
          >
            {item}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ProfileMenuDropdown({ profile }: { profile: FinScanProfileAvatar }) {
  const { isDark, setIsDark } = useTheme();

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button type="button" aria-label="User profile menu" className={profileTriggerClass}>
          {profile.imageUrl ? (
            <img
              src={profile.imageUrl}
              alt=""
              className="size-8 rounded-full object-cover"
            />
          ) : (
            <span
              className={cn(
                captionBold,
                "inline-flex size-8 items-center justify-center rounded-full bg-[var(--screening-surface-muted)] text-xs text-[var(--screening-text-primary)]",
              )}
            >
              {profile.initials}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={4}>
        <DropdownMenuLabel>Appearance</DropdownMenuLabel>
        <DropdownMenuToggleItem
          checked={isDark}
          onCheckedChange={(checked) => setIsDark(checked)}
        >
          Dark mode
        </DropdownMenuToggleItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function HeaderTrailingActions({ profile }: { profile: FinScanProfileAvatar }) {
  return (
    <div className="flex items-center gap-[var(--ace-site-header-toolbar-gap)] overflow-visible py-1">
      <SettingsMenuDropdown />
      <ToolbarIconButton label="Notifications">
        <MaterialSymbol name="notifications" size="md" />
      </ToolbarIconButton>
      <ToolbarIconButton label="Help">
        <MaterialSymbol name="help" size="md" />
      </ToolbarIconButton>
      <ProfileMenuDropdown profile={profile} />
    </div>
  );
}

function ProductAccent({ color }: { color: string }) {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-x-3 bottom-0 h-[3px] rounded-full"
      style={{ backgroundColor: color }}
    />
  );
}

function ProductNavSplit({
  label,
  selected,
  accent,
  onLabelSelect,
  children,
}: {
  label: string;
  selected: boolean;
  accent: string;
  onLabelSelect: () => void;
  children: ReactNode;
}) {
  const shellRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [alignOffset, setAlignOffset] = useState(0);

  const syncAlignOffset = () => {
    const shell = shellRef.current;
    const menuButton = menuButtonRef.current;
    if (!shell || !menuButton) return;
    // Anchor the menu to the full nav piece, not just the chevron trigger.
    setAlignOffset(-(shell.offsetWidth - menuButton.offsetWidth));
  };

  useLayoutEffect(() => {
    if (!open) return;
    syncAlignOffset();
    window.addEventListener("resize", syncAlignOffset);
    return () => window.removeEventListener("resize", syncAlignOffset);
  }, [open]);

  return (
    <DropdownMenu
      modal={false}
      open={open}
      onOpenChange={(nextOpen) => {
        if (nextOpen) syncAlignOffset();
        setOpen(nextOpen);
      }}
    >
      <div ref={shellRef} className={navSplitShellClass}>
        <button
          type="button"
          aria-current={selected ? "page" : undefined}
          aria-label={label}
          onClick={onLabelSelect}
          className={navLabelButtonClass}
        >
          {label}
        </button>
        <DropdownMenuTrigger asChild>
          <button
            ref={menuButtonRef}
            type="button"
            aria-label={`${label} menu`}
            className={navMenuButtonClass}
          >
            <MaterialSymbol name="keyboard_arrow_down" className={aceChevronIconClass} />
          </button>
        </DropdownMenuTrigger>
        {selected ? <ProductAccent color={accent} /> : null}
      </div>
      <DropdownMenuContent
        align="start"
        alignOffset={alignOffset}
        sideOffset={4}
        className="min-w-[16.5rem] p-2"
      >
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function WatchlistNavMenu({
  selected,
  accent,
  activeItem,
  onLandingSelect,
  onAssignedCasesSelect,
  onCaseBrowserSelect,
}: {
  selected: boolean;
  accent: string;
  activeItem: "assigned-cases" | "case-browser" | null;
  onLandingSelect: () => void;
  onAssignedCasesSelect: () => void;
  onCaseBrowserSelect: () => void;
}) {
  return (
    <ProductNavSplit
      label="Watchlist"
      selected={selected}
      accent={accent}
      onLabelSelect={onLandingSelect}
    >
      {WATCHLIST_FEATURE_ITEMS.map((itemLabel) => {
        const isAssignedCases = itemLabel === "Assigned Cases";
        const isCaseBrowser = itemLabel === "Case Browser";
        const isSelected =
          (isAssignedCases && activeItem === "assigned-cases") ||
          (isCaseBrowser && activeItem === "case-browser");
        const onSelect = isAssignedCases
          ? onAssignedCasesSelect
          : isCaseBrowser
            ? onCaseBrowserSelect
            : undefined;
        return (
          <DropdownMenuItem
            key={itemLabel}
            className={isSelected ? menuSelectedClass : menuItemClass}
            onSelect={onSelect}
          >
            {itemLabel}
          </DropdownMenuItem>
        );
      })}

      <DropdownMenuSeparator className={dashedSeparatorClass} />

      {SECTION_ITEMS.map((itemLabel) => (
        <DropdownMenuItem key={itemLabel} className={menuItemClass}>
          <span className="min-w-0 flex-1 truncate">{itemLabel}</span>
          <MaterialSymbol
            name="chevron_right"
            size="md"
            className={cn(aceChevronIconClass, "ml-auto text-[var(--ace-dropdown-menu-primary)]")}
          />
        </DropdownMenuItem>
      ))}
    </ProductNavSplit>
  );
}

function ProductLandingNavMenu({
  label,
  selected,
  accent,
  featureItems,
  onLandingSelect,
  onFeatureSelect,
  activeFeature,
  showSections = true,
}: {
  label: string;
  selected: boolean;
  accent: string;
  featureItems: readonly string[];
  onLandingSelect: () => void;
  onFeatureSelect?: (feature: string) => void;
  activeFeature?: string | null;
  showSections?: boolean;
}) {
  return (
    <ProductNavSplit
      label={label}
      selected={selected}
      accent={accent}
      onLabelSelect={onLandingSelect}
    >
      {featureItems.map((itemLabel) => {
        const isActive = activeFeature === itemLabel;
        return (
          <DropdownMenuItem
            key={itemLabel}
            className={isActive ? menuSelectedClass : menuItemClass}
            onSelect={onFeatureSelect ? () => onFeatureSelect(itemLabel) : undefined}
          >
            {itemLabel}
          </DropdownMenuItem>
        );
      })}

      {showSections ? (
        <>
          <DropdownMenuSeparator className={dashedSeparatorClass} />
          {SECTION_ITEMS.map((sectionLabel) => (
            <DropdownMenuItem key={sectionLabel} className={menuItemClass}>
              <span className="min-w-0 flex-1 truncate">{sectionLabel}</span>
              <MaterialSymbol
                name="chevron_right"
                size="md"
                className={cn(
                  aceChevronIconClass,
                  "ml-auto text-[var(--ace-dropdown-menu-primary)]",
                )}
              />
            </DropdownMenuItem>
          ))}
        </>
      ) : null}
    </ProductNavSplit>
  );
}

function ProductNav({ activeId }: { activeId: ProductNavId }) {
  const {
    appView,
    landingProduct,
    openWatchlistLanding,
    openPaymentsLanding,
    openKycLanding,
    openKycClientSearch,
    openReportingLanding,
    openReportingDashboard,
    openReportingReportLibrary,
    openReportingDataManager,
    openReviewAssigned,
    openCaseBrowser,
  } = useUserFlow();
  const watchlistActiveItem =
    appView === "review"
      ? "assigned-cases"
      : appView === "case-browser"
        ? "case-browser"
        : null;
  const kycActiveFeature = appView === "kyc-client-search" ? "Client Search" : null;
  const reportingActiveFeature =
    appView === "reporting-dashboard"
      ? "Dashboard"
      : appView === "reporting-report-library"
        ? "Report Library"
        : appView === "reporting-data-manager"
          ? "Data Manager"
          : null;

  return (
    <nav className="flex h-full min-w-0 items-center" aria-label="Product navigation">
      {PRODUCT_NAV.map((item) => {
        const selected = item.id === activeId;

        if (item.id === "watchlist") {
          return (
            <WatchlistNavMenu
              key={item.id}
              selected={selected}
              accent={item.accent}
              activeItem={watchlistActiveItem}
              onLandingSelect={openWatchlistLanding}
              onAssignedCasesSelect={openReviewAssigned}
              onCaseBrowserSelect={openCaseBrowser}
            />
          );
        }

        if (item.id === "payments") {
          return (
            <ProductLandingNavMenu
              key={item.id}
              label="Payments"
              selected={selected}
              accent={item.accent}
              featureItems={PAYMENTS_FEATURE_ITEMS}
              onLandingSelect={openPaymentsLanding}
            />
          );
        }

        if (item.id === "kyc") {
          return (
            <ProductLandingNavMenu
              key={item.id}
              label="KYC"
              selected={selected}
              accent={item.accent}
              featureItems={KYC_FEATURE_ITEMS}
              onLandingSelect={openKycLanding}
              activeFeature={kycActiveFeature}
              onFeatureSelect={(feature) => {
                if (feature === "Client Search") openKycClientSearch();
                else openKycLanding();
              }}
            />
          );
        }

        if (item.id === "reporting") {
          return (
            <ProductLandingNavMenu
              key={item.id}
              label="Reporting"
              selected={selected}
              accent={item.accent}
              featureItems={REPORTING_FEATURE_ITEMS}
              onLandingSelect={openReportingLanding}
              activeFeature={reportingActiveFeature}
              onFeatureSelect={(feature) => {
                if (feature === "Dashboard") openReportingDashboard();
                else if (feature === "Report Library") openReportingReportLibrary();
                else if (feature === "Data Manager") openReportingDataManager();
                else openReportingLanding();
              }}
              showSections={false}
            />
          );
        }

        return null;
      })}
    </nav>
  );
}

export function ReviewFlowSiteHeader({
  activeProduct,
}: {
  activeProduct?: ProductNavId;
} = {}) {
  const { flowId, appView, landingProduct, openStartPage } = useUserFlow();
  const profile = getProfileForUserFlow(flowId);

  const resolvedProduct: ProductNavId =
    activeProduct ??
    (appView === "review" || appView === "case-browser"
      ? "watchlist"
      : appView === "kyc-client-search"
        ? "kyc"
        : appView === "payments-management"
          ? "payments"
          : appView === "reporting-dashboard" ||
              appView === "reporting-report-library" ||
              appView === "reporting-data-manager"
            ? "reporting"
            : landingProduct);

  return (
    <div className="relative shrink-0">
      <AceSiteHeader
        userName={profile.greetingName}
        showNotifications={false}
        showHelp={false}
        showProfile={false}
        trailing={<HeaderTrailingActions profile={profile} />}
      >
        <ProductNav activeId={resolvedProduct} />
      </AceSiteHeader>
      {/* AceSiteHeader logo has no onClick prop yet — overlay navigates to start page. */}
      <button
        type="button"
        aria-label="Go to start page"
        onClick={openStartPage}
        className="absolute left-[var(--ace-site-header-px)] top-1/2 z-20 h-8 w-[7.75rem] -translate-y-1/2 rounded-[var(--radius-sm)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--screening-primary-ring)]"
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 flex h-[var(--ace-site-header-height)] items-center justify-center">
        <span
          className={cn(
            aceTypography(ACE_TYPE.captionBold),
            "inline-flex items-center rounded-[var(--radius-sm)] bg-red-600 px-3 py-1 uppercase tracking-[0.12em] text-white",
            aceDropShadowXsClass,
          )}
        >
          UX Concept
        </span>
      </div>
    </div>
  );
}
