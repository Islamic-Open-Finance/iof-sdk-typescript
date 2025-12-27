/**
 * Rail Types and Utilities
 * Definitions for all 19 Islamic Finance Rails
 */

// Rail Categories
export enum RailCategory {
  CORE = "CORE",
  ACCESS_IDENTITY = "ACCESS_IDENTITY",
  OPERATIONS = "OPERATIONS",
  FINANCIAL = "FINANCIAL",
  GOVERNANCE = "GOVERNANCE",
  EVENT_NOTIFICATION = "EVENT_NOTIFICATION",
  DEVELOPER_PARTNER = "DEVELOPER_PARTNER",
  OBSERVABILITY = "OBSERVABILITY",
}

// All Rails
export enum Rail {
  // Core Rails
  CONTRACTS = "CONTRACTS",
  JURISDICTIONS = "JURISDICTIONS",

  // Access & Identity Rails
  ACCESS_CONSENT = "ACCESS_CONSENT",
  KYC = "KYC",

  // Operations Rails
  CASES = "CASES",
  ZAKAT = "ZAKAT",
  RECONCILIATION = "RECONCILIATION",
  ROUTING = "ROUTING",
  DISPUTES = "DISPUTES",

  // Financial Rails
  MESSAGES = "MESSAGES",
  CLEARING = "CLEARING",
  TREASURY = "TREASURY",
  RISK = "RISK",
  PORTFOLIO = "PORTFOLIO",
  REPORTING = "REPORTING",

  // Governance Rails
  LEGAL = "LEGAL",
  UNDERWRITING = "UNDERWRITING",
  COMPLIANCE = "COMPLIANCE",
  GOVERNANCE = "GOVERNANCE",
  AML = "AML",
  CONSENT = "CONSENT",

  // Event & Notification Rails
  EVENTS = "EVENTS",
  NOTIFICATIONS = "NOTIFICATIONS",
  SEARCH = "SEARCH",

  // Developer & Partner Rails
  DEVELOPER = "DEVELOPER",
  PARTNERS = "PARTNERS",

  // Observability Rails
  OBSERVABILITY = "OBSERVABILITY",
}

// Rail Information
export interface RailInfo {
  rail: Rail;
  category: RailCategory;
  name: string;
  description: string;
  basePath: string;
  version: string;
}

export const RAIL_INFO: Record<Rail, RailInfo> = {
  [Rail.CONTRACTS]: {
    rail: Rail.CONTRACTS,
    category: RailCategory.CORE,
    name: "Contracts Rail",
    description: "Islamic finance contract lifecycle management",
    basePath: "/api/v1/contracts",
    version: "1.0.0",
  },
  [Rail.JURISDICTIONS]: {
    rail: Rail.JURISDICTIONS,
    category: RailCategory.CORE,
    name: "Jurisdictions Rail",
    description: "Multi-jurisdiction regulatory configurations",
    basePath: "/api/v1/jurisdictions",
    version: "1.0.0",
  },
  [Rail.ACCESS_CONSENT]: {
    rail: Rail.ACCESS_CONSENT,
    category: RailCategory.ACCESS_IDENTITY,
    name: "Access & Consent Rail",
    description: "Open Banking consent management (AISP/PISP)",
    basePath: "/api/v1/access/consents",
    version: "1.0.0",
  },
  [Rail.KYC]: {
    rail: Rail.KYC,
    category: RailCategory.ACCESS_IDENTITY,
    name: "KYC & Screening Rail",
    description: "Customer verification and screening",
    basePath: "/api/v1/kyc",
    version: "1.0.0",
  },
  [Rail.CASES]: {
    rail: Rail.CASES,
    category: RailCategory.OPERATIONS,
    name: "Cases & Disputes Rail",
    description: "Case and dispute management",
    basePath: "/api/v1/cases",
    version: "1.0.0",
  },
  [Rail.ZAKAT]: {
    rail: Rail.ZAKAT,
    category: RailCategory.OPERATIONS,
    name: "Zakat & Purification Rail",
    description: "Zakat calculation and purification",
    basePath: "/api/v1/zakat",
    version: "1.0.0",
  },
  [Rail.RECONCILIATION]: {
    rail: Rail.RECONCILIATION,
    category: RailCategory.OPERATIONS,
    name: "Reconciliation Rail",
    description: "Transaction reconciliation and matching",
    basePath: "/api/v1/reconciliation",
    version: "1.0.0",
  },
  [Rail.ROUTING]: {
    rail: Rail.ROUTING,
    category: RailCategory.OPERATIONS,
    name: "Routing Rail",
    description: "Payment and message routing rules",
    basePath: "/api/v1/routing",
    version: "1.0.0",
  },
  [Rail.MESSAGES]: {
    rail: Rail.MESSAGES,
    category: RailCategory.FINANCIAL,
    name: "Message Rail",
    description: "ISO 20022 messaging for Islamic finance",
    basePath: "/api/v1/messages",
    version: "1.0.0",
  },
  [Rail.CLEARING]: {
    rail: Rail.CLEARING,
    category: RailCategory.FINANCIAL,
    name: "Clearing Rail",
    description: "Settlement and multilateral netting",
    basePath: "/api/v1/clearing",
    version: "1.0.0",
  },
  [Rail.TREASURY]: {
    rail: Rail.TREASURY,
    category: RailCategory.FINANCIAL,
    name: "Treasury Rail",
    description: "Liquidity and cash management",
    basePath: "/api/v1/treasury",
    version: "1.0.0",
  },
  [Rail.RISK]: {
    rail: Rail.RISK,
    category: RailCategory.FINANCIAL,
    name: "Risk Rail",
    description: "Exposure and limit management",
    basePath: "/api/v1/risk",
    version: "1.0.0",
  },
  [Rail.PORTFOLIO]: {
    rail: Rail.PORTFOLIO,
    category: RailCategory.FINANCIAL,
    name: "Portfolio Rail",
    description: "Investment mandate and portfolio management",
    basePath: "/api/v1/portfolio",
    version: "1.0.0",
  },
  [Rail.REPORTING]: {
    rail: Rail.REPORTING,
    category: RailCategory.FINANCIAL,
    name: "Reporting Rail",
    description: "Analytics, dashboards, and report generation",
    basePath: "/api/v1/reporting",
    version: "1.0.0",
  },
  [Rail.LEGAL]: {
    rail: Rail.LEGAL,
    category: RailCategory.GOVERNANCE,
    name: "Legal & Documentation Rail",
    description: "Legal template and document management",
    basePath: "/api/v1/legal",
    version: "1.0.0",
  },
  [Rail.UNDERWRITING]: {
    rail: Rail.UNDERWRITING,
    category: RailCategory.GOVERNANCE,
    name: "Underwriting Rail",
    description: "Credit and risk assessment",
    basePath: "/api/v1/underwriting",
    version: "1.0.0",
  },
  [Rail.COMPLIANCE]: {
    rail: Rail.COMPLIANCE,
    category: RailCategory.GOVERNANCE,
    name: "Compliance Rail",
    description: "Regulatory and Shariah compliance",
    basePath: "/api/v1/compliance",
    version: "1.0.0",
  },
  [Rail.GOVERNANCE]: {
    rail: Rail.GOVERNANCE,
    category: RailCategory.GOVERNANCE,
    name: "Governance Rail",
    description: "Shariah board and committee management",
    basePath: "/api/v1/governance",
    version: "1.0.0",
  },
  [Rail.EVENTS]: {
    rail: Rail.EVENTS,
    category: RailCategory.EVENT_NOTIFICATION,
    name: "Events Rail",
    description: "Event publishing and webhook management",
    basePath: "/api/v1/events",
    version: "1.0.0",
  },
  [Rail.NOTIFICATIONS]: {
    rail: Rail.NOTIFICATIONS,
    category: RailCategory.EVENT_NOTIFICATION,
    name: "Notifications Rail",
    description: "Multi-channel notifications",
    basePath: "/api/v1/notifications",
    version: "1.0.0",
  },
  [Rail.SEARCH]: {
    rail: Rail.SEARCH,
    category: RailCategory.EVENT_NOTIFICATION,
    name: "Search Rail",
    description:
      "Full-text search across contracts, parties, cases, and SKUs powered by Meilisearch",
    basePath: "/api/v1/search",
    version: "1.0.0",
  },
  [Rail.AML]: {
    rail: Rail.AML,
    category: RailCategory.GOVERNANCE,
    name: "AML/CFT Rail",
    description:
      "Anti-Money Laundering and Counter-Terrorist Financing compliance",
    basePath: "/api/v1/aml",
    version: "1.0.0",
  },
  [Rail.CONSENT]: {
    rail: Rail.CONSENT,
    category: RailCategory.GOVERNANCE,
    name: "Consent & Privacy Rail",
    description: "GDPR/CCPA compliance and data privacy management",
    basePath: "/api/v1/consent",
    version: "1.0.0",
  },
  [Rail.DEVELOPER]: {
    rail: Rail.DEVELOPER,
    category: RailCategory.DEVELOPER_PARTNER,
    name: "Developer & Integration Rail",
    description: "Developer portal, API keys, and integration management",
    basePath: "/api/v1/developer",
    version: "1.0.0",
  },
  [Rail.PARTNERS]: {
    rail: Rail.PARTNERS,
    category: RailCategory.DEVELOPER_PARTNER,
    name: "Partner & Embedded Finance Rail",
    description: "Partner programs, revenue sharing, and embedded finance",
    basePath: "/api/v1/partners",
    version: "1.0.0",
  },
  [Rail.DISPUTES]: {
    rail: Rail.DISPUTES,
    category: RailCategory.OPERATIONS,
    name: "Disputes & Collections Rail",
    description: "Dispute management and debt collections",
    basePath: "/api/v1/disputes",
    version: "1.0.0",
  },
  [Rail.OBSERVABILITY]: {
    rail: Rail.OBSERVABILITY,
    category: RailCategory.OBSERVABILITY,
    name: "Observability Rail",
    description: "SLOs, audit logs, Shariah monitoring, and data export",
    basePath: "/api/v1/observability",
    version: "1.0.0",
  },
};

// Helper functions
export function getRailsByCategory(category: RailCategory): Rail[] {
  return Object.values(Rail).filter(
    (rail) => RAIL_INFO[rail].category === category,
  );
}

export function getRailInfo(rail: Rail): RailInfo {
  return RAIL_INFO[rail];
}

export function getAllRails(): RailInfo[] {
  return Object.values(RAIL_INFO);
}

export function getCoreRails(): RailInfo[] {
  return getRailsByCategory(RailCategory.CORE).map((r) => RAIL_INFO[r]);
}

export function getFinancialRails(): RailInfo[] {
  return getRailsByCategory(RailCategory.FINANCIAL).map((r) => RAIL_INFO[r]);
}

export function getGovernanceRails(): RailInfo[] {
  return getRailsByCategory(RailCategory.GOVERNANCE).map((r) => RAIL_INFO[r]);
}
