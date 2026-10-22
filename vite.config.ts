import { defineConfig } from 'vite'
import path from 'path'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

const require = createRequire(import.meta.url)

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/** ACE Design System (ACEDesignSystem / ds-github) — local sandbox clone */
const aceDesignSystemSrc = path.resolve(
  __dirname,
  '../../Design System/Design System Sandbox/src',
)

function toPosix(p: string) {
  return p.split(path.sep).join('/')
}

/**
 * ACEDesignSystem renamed Ace* folders (AceAccordion → Accordion, etc.) and left
 * only index re-exports. This app still deep-imports Ace* paths; synthesize Ace-named
 * re-exports so local + CI builds keep working.
 */
function aceLegacyDeepImportCompat() {
  const ds = toPosix(aceDesignSystemSrc)
  const PREFIX = '\0ace-legacy:'

  const modules: Record<string, string> = {
    '@ace-ds/components/molecules/AceAccordion/MaterialSymbol': `
export { MaterialSymbol } from '${ds}/components/molecules/Accordion/MaterialSymbol.tsx'
`,
    '@ace-ds/components/molecules/AceAccordion/AceAccordion': `
export {
  Accordion as AceAccordion,
  type AccordionProps as AceAccordionProps,
  type AccordionSurface as AceAccordionSurface,
} from '${ds}/components/molecules/Accordion/Accordion.tsx'
`,
    '@ace-ds/components/organisms/AceCards/AceLandingPageCard': `
export {
  LandingPageCard as AceLandingPageCard,
  type LandingPageCardFooterStat as AceLandingPageCardFooterStat,
  type LandingPageCardProps as AceLandingPageCardProps,
  type LandingPageCardStatItem as AceLandingPageCardStatItem,
  type LandingPageCardVariant as AceLandingPageCardVariant,
} from '${ds}/components/organisms/Cards/LandingPageCard.tsx'
`,
    '@ace-ds/components/atoms/AceBadge/AceBadge': `
export { Badge as AceBadge, type BadgeProps as AceBadgeProps } from '${ds}/components/atoms/Badge/Badge.tsx'
`,
    '@ace-ds/components/atoms/AceBadge/badgeFieldStyles': `
export {
  type BadgeVariant as AceBadgeVariant,
  type BadgeAppearance as AceBadgeAppearance,
  badgeStatusShellClass as aceBadgeStatusShellClass,
  badgeTagShellClass as aceBadgeTagShellClass,
  badgeStatusDotClass as aceBadgeStatusDotClass,
  badgeStatusLabelClass as aceBadgeStatusLabelClass,
  badgeTagLabelClass as aceBadgeTagLabelClass,
  badgeWarningIconClass as aceBadgeWarningIconClass,
  badgeVariantTokens as aceBadgeVariantTokens,
  badgeTagNeutralTokens as aceBadgeTagNeutralTokens,
  badgeTagWarningTokens as aceBadgeTagWarningTokens,
  badgeShellClass as aceBadgeShellClass,
  badgeDotClass as aceBadgeDotClass,
  badgeLabelClass as aceBadgeLabelClass,
} from '${ds}/components/atoms/Badge/badgeFieldStyles.ts'
`,
    '@ace-ds/components/atoms/AceTabs/AceTabs': `
export {
  Tabs as AceTabs,
  tabButtonId as aceTabButtonId,
  type TabItem as AceTabItem,
  type TabsOrientation as AceTabsOrientation,
  type TabsProps as AceTabsProps,
} from '${ds}/components/atoms/Tabs/Tabs.tsx'
`,
    '@ace-ds/components/atoms/AceTooltip/AceTooltip': `
export {
  Tooltip as AceTooltip,
  TooltipContent as AceTooltipContent,
  TooltipProvider as AceTooltipProvider,
  TooltipTrigger as AceTooltipTrigger,
  TooltipIconWrap as AceTooltipIconWrap,
} from '${ds}/components/atoms/Tooltip/Tooltip.tsx'
`,
    '@ace-ds/components/molecules/AceDropdownMenu/AceDropdownMenu': `
export {
  DropdownMenu as AceDropdownMenu,
  DropdownMenuPanel as AceDropdownMenuPanel,
  dropdownMenuPanelClass as aceDropdownMenuPanelClass,
  type DropdownMenuEntry as AceDropdownMenuEntry,
  type DropdownMenuPanelProps as AceDropdownMenuPanelProps,
  type DropdownMenuPanelWidth as AceDropdownMenuPanelWidth,
  type DropdownMenuProps as AceDropdownMenuProps,
  type DropdownMenuSubItem as AceDropdownMenuSubItem,
  type DropdownTriggerMode as AceDropdownTriggerMode,
} from '${ds}/components/molecules/DropdownMenu/DropdownMenu.tsx'
`,
    '@ace-ds/components/molecules/AceDropdownMenu/dropdownFieldStyles': `
export {
  AceDropdownChevron,
  aceDropdownTriggerType,
  aceDropdownFieldLabelClass,
  aceDropdownFieldTriggerClass,
  aceDropdownFieldChevronClass,
} from '${ds}/components/molecules/DropdownMenu/dropdownFieldStyles.tsx'
`,
    '@ace-ds/components/organisms/AceDatePicker/AceDatePicker': `
export {
  DatePicker as AceDatePicker,
  type DatePickerMode as AceDatePickerMode,
  type DatePickerProps as AceDatePickerProps,
  type DatePickerRangeProps as AceDatePickerRangeProps,
  type DatePickerSingleProps as AceDatePickerSingleProps,
  type DateRangeValue,
  type PartialDateRange,
} from '${ds}/components/organisms/DatePicker/DatePicker.tsx'
`,
    '@ace-ds/components/organisms/AceScrollableList/scrollableListFieldStyles': `
export {
  scrollableListNotoVar as aceScrollableListNotoVar,
  scrollableListShellClass as aceScrollableListShellClass,
  scrollableListShellExpandedClass as aceScrollableListShellExpandedClass,
  scrollableListShellMinimizedClass as aceScrollableListShellMinimizedClass,
  scrollableListHeaderClass as aceScrollableListHeaderClass,
  scrollableListTitleClass as aceScrollableListTitleClass,
  scrollableListControlsClass as aceScrollableListControlsClass,
  scrollableListScrollClass as aceScrollableListScrollClass,
  scrollableListSectionHeaderClass as aceScrollableListSectionHeaderClass,
  scrollableListSectionTitleClass as aceScrollableListSectionTitleClass,
  scrollableListItemsClass as aceScrollableListItemsClass,
  scrollableListItemClass as aceScrollableListItemClass,
  scrollableListItemSelectedClass as aceScrollableListItemSelectedClass,
  scrollableListItemFocusRingClass as aceScrollableListItemFocusRingClass,
  scrollableListItemLabelClass as aceScrollableListItemLabelClass,
  scrollableListItemDescriptionClass as aceScrollableListItemDescriptionClass,
  scrollableListMinimizedClass as aceScrollableListMinimizedClass,
  scrollableListMinimizedTitleClass as aceScrollableListMinimizedTitleClass,
} from '${ds}/components/organisms/ScrollableList/scrollableListFieldStyles.ts'
`,
    '@ace-ds/components/organisms/AceSidebar/sidebarRowActions': `
export {
  sidebarIconButtonClass,
  sidebarIconButtonBorderedClass,
  sidebarRowActionButtonClass,
  sidebarRowActionButtonExpandedClass,
  sidebarRowActionIconClass,
} from '${ds}/components/organisms/Sidebar/sidebarRowActions.ts'
`,
    '@ace-ds/components/organisms/AceSidebar/AceSidebar': `
export {
  Sidebar as AceSidebar,
  type SidebarGroup as AceSidebarGroup,
  type SidebarMenuAction as AceSidebarMenuAction,
  type SidebarNavItem as AceSidebarNavItem,
  type SidebarOrganization as AceSidebarOrganization,
  type SidebarOrganizationDisplay as AceSidebarOrganizationDisplay,
  type SidebarProps as AceSidebarProps,
  type SidebarVariant as AceSidebarVariant,
} from '${ds}/components/organisms/Sidebar/Sidebar.tsx'
`,
    '@ace-ds/components/organisms/AceSidebar/GroupFormDialog': `
export {
  GroupFormDialog,
  type GroupFormDialogItem,
  type GroupFormDialogMode,
  type GroupFormDialogProps,
} from '${ds}/components/organisms/Sidebar/GroupFormDialog.tsx'
`,
    '@ace-ds/components/organisms/AceSiteHeader/AceSiteHeader': `
export {
  SiteHeader as AceSiteHeader,
  type SiteHeaderNavItem as AceSiteHeaderNavItem,
  type SiteHeaderProps as AceSiteHeaderProps,
} from '${ds}/components/organisms/SiteHeader/SiteHeader.tsx'
`,
    '@ace-ds/components/organisms/AceAttachments/AceAttachments': `
export {
  Attachments as AceAttachments,
  DEMO_ATTACHMENT_FILES,
  DEMO_ATTACHMENT_LINKS,
  type AttachmentFile as AceAttachmentFile,
  type AttachmentLink as AceAttachmentLink,
  type AttachmentsProps as AceAttachmentsProps,
} from '${ds}/components/organisms/Attachments/Attachments.tsx'
`,
    '@ace-ds/components/molecules/AceFiltering/AceFilterToggleChip': `
export {
  FilterToggleChip as AceFilterToggleChip,
  type FilterToggleChipProps as AceFilterToggleChipProps,
} from '${ds}/components/molecules/Filtering/FilterToggleChip.tsx'
`,
    '@ace-ds/components/molecules/AcePagination/AcePagination': `
export {
  Pagination as AcePagination,
  TablePagination as AceTablePagination,
  rangeLabel,
  visiblePageItems,
  type PaginationProps as AcePaginationProps,
  type TablePaginationProps as AceTablePaginationProps,
} from '${ds}/components/molecules/Pagination/Pagination.tsx'
`,
    '@ace-ds/components/organisms/AceTimeline/AceTimeline': `
export {
  Timeline as AceTimeline,
  DEMO_TIMELINE_ITEMS,
  type TimelineProps as AceTimelineProps,
  type TimelineItemData as AceTimelineItemData,
  type TimelineItemSurface as AceTimelineItemSurface,
  type TimelineSort as AceTimelineSort,
  type TimelineVariant as AceTimelineVariant,
} from '${ds}/components/organisms/Timeline/Timeline.tsx'
`,
    '@ace-ds/components/molecules/AceTable/AceTable': `
export {
  Table as AceTable,
  type TableColumn as AceTableColumn,
  type TableProps as AceTableProps,
} from '${ds}/components/molecules/Table/Table.tsx'
`,
  }

  return {
    name: 'ace-legacy-deep-import-compat',
    enforce: 'pre' as const,
    resolveId(id: string) {
      if (modules[id]) return PREFIX + id
      return null
    },
    load(id: string) {
      if (!id.startsWith(PREFIX)) return null
      return modules[id.slice(PREFIX.length)] ?? null
    },
  }
}

function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id: string) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

/** @ace-ds lives outside this repo; resolve its npm imports from our node_modules (CI has no DS install). */
function aceDsDependencyResolver() {
  const dsMarker = `${path.sep}Design System${path.sep}`
  return {
    name: 'ace-ds-dependency-resolver',
    enforce: 'pre' as const,
    resolveId(source: string, importer?: string) {
      if (!importer?.includes(dsMarker)) return null
      if (source.startsWith('.') || source.startsWith('\0') || path.isAbsolute(source)) {
        return null
      }
      try {
        return require.resolve(source, { paths: [__dirname] })
      } catch {
        return null
      }
    },
  }
}

// Local dev: `/`. GitHub Actions sets `VITE_BASE_PATH` to `/<repo>/` so asset URLs work with or
// without a trailing slash on `…github.io/<repo>` (relative `./` bases break without `/`).
function viteBase(): string {
  const raw = process.env.VITE_BASE_PATH?.trim()
  if (!raw || raw === '/') {
    return '/'
  }
  const withLeading = raw.startsWith('/') ? raw : `/${raw}`
  return withLeading.endsWith('/') ? withLeading : `${withLeading}/`
}

export default defineConfig({
  base: viteBase(),
  plugins: [
    aceLegacyDeepImportCompat(),
    aceDsDependencyResolver(),
    figmaAssetResolver(),
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@ace-ds': aceDesignSystemSrc,
    },
  },
  server: {
    fs: {
      allow: [path.resolve(__dirname, '..'), path.resolve(__dirname, '../..')],
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
