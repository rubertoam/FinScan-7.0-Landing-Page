import { useMemo } from "react";
import { useUserFlow } from "../flows/FlowContext";
import {
  ProductLandingPage,
  type LandingFeatureCard,
  type LandingLinkColumn,
} from "./ProductLandingPage";

const HERO_DESCRIPTION =
  "Perform real-time compliance checks on potential customers and vendors using KYC features, which can include screening against sanctions lists and adverse media, as well as ID authentication, and identity verification.";

const LINK_COLUMNS: readonly LandingLinkColumn[] = [
  {
    id: "dashboards",
    title: "KYC Dashboards",
    icon: "public",
    links: [
      "Media Classification",
      "Client Overrides",
      "Status Distribution",
      "Referral Resolution",
    ],
  },
  {
    id: "reports",
    title: "KYC Reports",
    icon: "bar_chart",
    links: [
      "Search Classification Summary Report",
      "Total Searches by Application Report",
      "Client Query Report",
      "Media Module Summary Report",
    ],
  },
  {
    id: "more",
    title: "More Links",
    icon: "open_in_new",
    links: ["Dashboard", "Report Library", "Data Manager", "Resource Center", "My Settings"],
  },
];

export function KycLandingPage() {
  const { openKycClientSearch } = useUserFlow();

  const featureCards = useMemo(
    (): LandingFeatureCard[] => [
      {
        id: "client-search",
        title: "Client Search",
        description: "Description of the feature goes here...",
        navigates: true,
        onActivate: openKycClientSearch,
      },
      {
        id: "media-search",
        title: "Media Search",
        description: "Description of the feature goes here...",
      },
      {
        id: "verify-search",
        title: "Verify Search",
        description: "Description of the feature goes here...",
      },
      {
        id: "validate-search",
        title: "Validate Search",
        description: "Description of the feature goes here...",
      },
      {
        id: "add-client",
        title: "Add Client",
        description: "Description of the feature goes here...",
      },
      {
        id: "upload-client-file",
        title: "Upload Client File",
        description: "Description of the feature goes here...",
      },
    ],
    [openKycClientSearch],
  );

  return (
    <ProductLandingPage
      product="kyc"
      palette="innovative-blue"
      heroDescription={HERO_DESCRIPTION}
      featureCards={featureCards}
      linkColumns={LINK_COLUMNS}
    />
  );
}
