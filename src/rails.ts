/**
 * Rail Types and Utilities
 * Definitions for all 125 Islamic Finance Rails across 12 categories
 */

// Rail Categories
export enum RailCategory {
  CORE_ISLAMIC_CONTRACTS = "CORE_ISLAMIC_CONTRACTS",
  CAPITAL_MARKETS = "CAPITAL_MARKETS",
  ISLAMIC_FUNDS = "ISLAMIC_FUNDS",
  TAKAFUL = "TAKAFUL",
  WAQF_SOCIAL_FINANCE = "WAQF_SOCIAL_FINANCE",
  TRADE_FINANCE = "TRADE_FINANCE",
  ACCESS_IDENTITY = "ACCESS_IDENTITY",
  OPERATIONS = "OPERATIONS",
  FINANCIAL = "FINANCIAL",
  GOVERNANCE = "GOVERNANCE",
  PLATFORM = "PLATFORM",
  OBSERVABILITY = "OBSERVABILITY",
}

// All Rails (125 total)
export enum Rail {
  // ── Core Islamic Contracts ──
  MURABAHA = "MURABAHA",
  IJARAH = "IJARAH",
  MUSHARAKAH = "MUSHARAKAH",
  DIMINISHING_MUSHARAKAH = "DIMINISHING_MUSHARAKAH",
  MUDARABAH = "MUDARABAH",
  SALAM = "SALAM",
  ISTISNA = "ISTISNA",
  WAKALAH = "WAKALAH",
  WADIAH = "WADIAH",
  QARD = "QARD",
  QARD_HASAN = "QARD_HASAN",
  KAFALAH = "KAFALAH",
  RAHNU = "RAHNU",
  HAWALAH = "HAWALAH",
  TABARRU = "TABARRU",
  HIBAH = "HIBAH",
  UJRAH = "UJRAH",
  JUALAH = "JUALAH",
  IBRAA = "IBRAA",
  MUQASAH = "MUQASAH",
  ASSET_FINANCE = "ASSET_FINANCE",
  ISLAMIC_FACTORING = "ISLAMIC_FACTORING",
  ISLAMIC_MICROFINANCE = "ISLAMIC_MICROFINANCE",
  CONTRACTS = "CONTRACTS",
  CONTRACT_LIFECYCLE = "CONTRACT_LIFECYCLE",

  // ── Capital Markets / Sukuk ──
  SUKUK = "SUKUK",
  SPV_TRUST = "SPV_TRUST",
  NAV_VALUATION = "NAV_VALUATION",

  // ── Islamic Funds ──
  FUNDS = "FUNDS",
  FUND_SETUP = "FUND_SETUP",

  // ── Takaful (Islamic Insurance) ──
  TAKAFUL = "TAKAFUL",

  // ── Waqf & Social Finance ──
  WAQF = "WAQF",
  SADAQAH = "SADAQAH",
  ZAKAT = "ZAKAT",
  ZAKAT_ENHANCED = "ZAKAT_ENHANCED",
  CLEANSING_PURIFICATION = "CLEANSING_PURIFICATION",

  // ── Trade Finance ──
  TRADE = "TRADE",
  TRADE_FINANCE = "TRADE_FINANCE",

  // ── Access & Identity ──
  AUTH = "AUTH",
  MFA = "MFA",
  OAUTH2 = "OAUTH2",
  SAML = "SAML",
  PASSKEYS = "PASSKEYS",
  API_KEYS = "API_KEYS",
  ACCESS_CONSENT = "ACCESS_CONSENT",
  ONBOARDING = "ONBOARDING",
  KYC_ONBOARDING = "KYC_ONBOARDING",
  KYC_ENHANCED = "KYC_ENHANCED",
  RESIDENCY = "RESIDENCY",
  INVITATIONS = "INVITATIONS",

  // ── Operations ──
  CASES = "CASES",
  DISPUTES = "DISPUTES",
  RECONCILIATION = "RECONCILIATION",
  ROUTING = "ROUTING",
  PAYMENTS = "PAYMENTS",
  PAYMENT_GATEWAY = "PAYMENT_GATEWAY",
  PAYMENT_INITIATION = "PAYMENT_INITIATION",
  SETTLEMENT = "SETTLEMENT",
  CLEARING = "CLEARING",
  COLLATERAL = "COLLATERAL",
  DEBT = "DEBT",
  PROFIT_DISTRIBUTION = "PROFIT_DISTRIBUTION",
  ACCOUNT_INFORMATION = "ACCOUNT_INFORMATION",

  // ── Financial ──
  TREASURY = "TREASURY",
  FX = "FX",
  LIQUIDITY = "LIQUIDITY",
  RISK = "RISK",
  PORTFOLIO = "PORTFOLIO",
  REPORTING = "REPORTING",
  BILLING = "BILLING",
  FINOPS = "FINOPS",
  UNDERWRITING = "UNDERWRITING",
  BASEL = "BASEL",
  PRUDENTIAL = "PRUDENTIAL",
  ISO20022 = "ISO20022",
  MESSAGES = "MESSAGES",

  // ── Governance & Compliance ──
  GOVERNANCE = "GOVERNANCE",
  COMPLIANCE = "COMPLIANCE",
  AML_COMPLIANCE = "AML_COMPLIANCE",
  SHARIAH_COMPLIANCE = "SHARIAH_COMPLIANCE",
  SHARIAH_GOVERNANCE = "SHARIAH_GOVERNANCE",
  SHARIAH_RULES = "SHARIAH_RULES",
  SHARIAH_SCREENING = "SHARIAH_SCREENING",
  LEGAL = "LEGAL",
  CONSENT = "CONSENT",
  CONSENT_PRIVACY = "CONSENT_PRIVACY",
  GDPR = "GDPR",
  GRC = "GRC",
  EVIDENCE_PACK = "EVIDENCE_PACK",
  AUDIT = "AUDIT",
  AUDIT_ANALYTICS = "AUDIT_ANALYTICS",
  JURISDICTIONS = "JURISDICTIONS",

  // ── Platform ──
  DEVELOPER = "DEVELOPER",
  PARTNERS = "PARTNERS",
  PRODUCTS = "PRODUCTS",
  PROGRAMS = "PROGRAMS",
  WORKSPACES = "WORKSPACES",
  FEATURE_FLAGS = "FEATURE_FLAGS",
  BYOC = "BYOC",
  AGENT_RAIL = "AGENT_RAIL",
  INTEGRATIONS = "INTEGRATIONS",

  // ── Documents ──
  DOCUMENTS = "DOCUMENTS",
  DOCUMENT_MANAGEMENT = "DOCUMENT_MANAGEMENT",
  DOCUMENT_SIGNING = "DOCUMENT_SIGNING",
  DOCUMENT_VAULT = "DOCUMENT_VAULT",

  // ── Data & Operations ──
  DATA_QUALITY = "DATA_QUALITY",
  LIMITS = "LIMITS",
  RETENTION = "RETENTION",
  SECRETS = "SECRETS",
  SLA_INCIDENT = "SLA_INCIDENT",
  REFERENCE_DATA = "REFERENCE_DATA",

  // ── Notifications & Events ──
  EVENTS = "EVENTS",
  NOTIFICATIONS = "NOTIFICATIONS",
  NOTIFICATION_HUB = "NOTIFICATION_HUB",
  NOTIFICATION_PREFERENCES = "NOTIFICATION_PREFERENCES",
  ALERTING = "ALERTING",

  // ── Observability ──
  OBSERVABILITY = "OBSERVABILITY",
  HEALTH = "HEALTH",
  ANALYTICS = "ANALYTICS",
  DASHBOARD = "DASHBOARD",
  SEARCH = "SEARCH",
  METADATA = "METADATA",
  TAXONOMY = "TAXONOMY",
  WEBHOOKS = "WEBHOOKS",
  OMNI = "OMNI",
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

// Category mapping for all rails
const CATEGORY_MAP: Record<Rail, RailCategory> = {
  // Core Islamic Contracts
  [Rail.MURABAHA]: RailCategory.CORE_ISLAMIC_CONTRACTS,
  [Rail.IJARAH]: RailCategory.CORE_ISLAMIC_CONTRACTS,
  [Rail.MUSHARAKAH]: RailCategory.CORE_ISLAMIC_CONTRACTS,
  [Rail.DIMINISHING_MUSHARAKAH]: RailCategory.CORE_ISLAMIC_CONTRACTS,
  [Rail.MUDARABAH]: RailCategory.CORE_ISLAMIC_CONTRACTS,
  [Rail.SALAM]: RailCategory.CORE_ISLAMIC_CONTRACTS,
  [Rail.ISTISNA]: RailCategory.CORE_ISLAMIC_CONTRACTS,
  [Rail.WAKALAH]: RailCategory.CORE_ISLAMIC_CONTRACTS,
  [Rail.WADIAH]: RailCategory.CORE_ISLAMIC_CONTRACTS,
  [Rail.QARD]: RailCategory.CORE_ISLAMIC_CONTRACTS,
  [Rail.QARD_HASAN]: RailCategory.CORE_ISLAMIC_CONTRACTS,
  [Rail.KAFALAH]: RailCategory.CORE_ISLAMIC_CONTRACTS,
  [Rail.RAHNU]: RailCategory.CORE_ISLAMIC_CONTRACTS,
  [Rail.HAWALAH]: RailCategory.CORE_ISLAMIC_CONTRACTS,
  [Rail.TABARRU]: RailCategory.CORE_ISLAMIC_CONTRACTS,
  [Rail.HIBAH]: RailCategory.CORE_ISLAMIC_CONTRACTS,
  [Rail.UJRAH]: RailCategory.CORE_ISLAMIC_CONTRACTS,
  [Rail.JUALAH]: RailCategory.CORE_ISLAMIC_CONTRACTS,
  [Rail.IBRAA]: RailCategory.CORE_ISLAMIC_CONTRACTS,
  [Rail.MUQASAH]: RailCategory.CORE_ISLAMIC_CONTRACTS,
  [Rail.ASSET_FINANCE]: RailCategory.CORE_ISLAMIC_CONTRACTS,
  [Rail.ISLAMIC_FACTORING]: RailCategory.CORE_ISLAMIC_CONTRACTS,
  [Rail.ISLAMIC_MICROFINANCE]: RailCategory.CORE_ISLAMIC_CONTRACTS,
  [Rail.CONTRACTS]: RailCategory.CORE_ISLAMIC_CONTRACTS,
  [Rail.CONTRACT_LIFECYCLE]: RailCategory.CORE_ISLAMIC_CONTRACTS,

  // Capital Markets
  [Rail.SUKUK]: RailCategory.CAPITAL_MARKETS,
  [Rail.SPV_TRUST]: RailCategory.CAPITAL_MARKETS,
  [Rail.NAV_VALUATION]: RailCategory.CAPITAL_MARKETS,

  // Islamic Funds
  [Rail.FUNDS]: RailCategory.ISLAMIC_FUNDS,
  [Rail.FUND_SETUP]: RailCategory.ISLAMIC_FUNDS,

  // Takaful
  [Rail.TAKAFUL]: RailCategory.TAKAFUL,

  // Waqf & Social Finance
  [Rail.WAQF]: RailCategory.WAQF_SOCIAL_FINANCE,
  [Rail.SADAQAH]: RailCategory.WAQF_SOCIAL_FINANCE,
  [Rail.ZAKAT]: RailCategory.WAQF_SOCIAL_FINANCE,
  [Rail.ZAKAT_ENHANCED]: RailCategory.WAQF_SOCIAL_FINANCE,
  [Rail.CLEANSING_PURIFICATION]: RailCategory.WAQF_SOCIAL_FINANCE,

  // Trade Finance
  [Rail.TRADE]: RailCategory.TRADE_FINANCE,
  [Rail.TRADE_FINANCE]: RailCategory.TRADE_FINANCE,

  // Access & Identity
  [Rail.AUTH]: RailCategory.ACCESS_IDENTITY,
  [Rail.MFA]: RailCategory.ACCESS_IDENTITY,
  [Rail.OAUTH2]: RailCategory.ACCESS_IDENTITY,
  [Rail.SAML]: RailCategory.ACCESS_IDENTITY,
  [Rail.PASSKEYS]: RailCategory.ACCESS_IDENTITY,
  [Rail.API_KEYS]: RailCategory.ACCESS_IDENTITY,
  [Rail.ACCESS_CONSENT]: RailCategory.ACCESS_IDENTITY,
  [Rail.ONBOARDING]: RailCategory.ACCESS_IDENTITY,
  [Rail.KYC_ONBOARDING]: RailCategory.ACCESS_IDENTITY,
  [Rail.KYC_ENHANCED]: RailCategory.ACCESS_IDENTITY,
  [Rail.RESIDENCY]: RailCategory.ACCESS_IDENTITY,
  [Rail.INVITATIONS]: RailCategory.ACCESS_IDENTITY,

  // Operations
  [Rail.CASES]: RailCategory.OPERATIONS,
  [Rail.DISPUTES]: RailCategory.OPERATIONS,
  [Rail.RECONCILIATION]: RailCategory.OPERATIONS,
  [Rail.ROUTING]: RailCategory.OPERATIONS,
  [Rail.PAYMENTS]: RailCategory.OPERATIONS,
  [Rail.PAYMENT_GATEWAY]: RailCategory.OPERATIONS,
  [Rail.PAYMENT_INITIATION]: RailCategory.OPERATIONS,
  [Rail.SETTLEMENT]: RailCategory.OPERATIONS,
  [Rail.CLEARING]: RailCategory.OPERATIONS,
  [Rail.COLLATERAL]: RailCategory.OPERATIONS,
  [Rail.DEBT]: RailCategory.OPERATIONS,
  [Rail.PROFIT_DISTRIBUTION]: RailCategory.OPERATIONS,
  [Rail.ACCOUNT_INFORMATION]: RailCategory.OPERATIONS,

  // Financial
  [Rail.TREASURY]: RailCategory.FINANCIAL,
  [Rail.FX]: RailCategory.FINANCIAL,
  [Rail.LIQUIDITY]: RailCategory.FINANCIAL,
  [Rail.RISK]: RailCategory.FINANCIAL,
  [Rail.PORTFOLIO]: RailCategory.FINANCIAL,
  [Rail.REPORTING]: RailCategory.FINANCIAL,
  [Rail.BILLING]: RailCategory.FINANCIAL,
  [Rail.FINOPS]: RailCategory.FINANCIAL,
  [Rail.UNDERWRITING]: RailCategory.FINANCIAL,
  [Rail.BASEL]: RailCategory.FINANCIAL,
  [Rail.PRUDENTIAL]: RailCategory.FINANCIAL,
  [Rail.ISO20022]: RailCategory.FINANCIAL,
  [Rail.MESSAGES]: RailCategory.FINANCIAL,

  // Governance
  [Rail.GOVERNANCE]: RailCategory.GOVERNANCE,
  [Rail.COMPLIANCE]: RailCategory.GOVERNANCE,
  [Rail.AML_COMPLIANCE]: RailCategory.GOVERNANCE,
  [Rail.SHARIAH_COMPLIANCE]: RailCategory.GOVERNANCE,
  [Rail.SHARIAH_GOVERNANCE]: RailCategory.GOVERNANCE,
  [Rail.SHARIAH_RULES]: RailCategory.GOVERNANCE,
  [Rail.SHARIAH_SCREENING]: RailCategory.GOVERNANCE,
  [Rail.LEGAL]: RailCategory.GOVERNANCE,
  [Rail.CONSENT]: RailCategory.GOVERNANCE,
  [Rail.CONSENT_PRIVACY]: RailCategory.GOVERNANCE,
  [Rail.GDPR]: RailCategory.GOVERNANCE,
  [Rail.GRC]: RailCategory.GOVERNANCE,
  [Rail.EVIDENCE_PACK]: RailCategory.GOVERNANCE,
  [Rail.AUDIT]: RailCategory.GOVERNANCE,
  [Rail.AUDIT_ANALYTICS]: RailCategory.GOVERNANCE,
  [Rail.JURISDICTIONS]: RailCategory.GOVERNANCE,

  // Platform
  [Rail.DEVELOPER]: RailCategory.PLATFORM,
  [Rail.PARTNERS]: RailCategory.PLATFORM,
  [Rail.PRODUCTS]: RailCategory.PLATFORM,
  [Rail.PROGRAMS]: RailCategory.PLATFORM,
  [Rail.WORKSPACES]: RailCategory.PLATFORM,
  [Rail.FEATURE_FLAGS]: RailCategory.PLATFORM,
  [Rail.BYOC]: RailCategory.PLATFORM,
  [Rail.AGENT_RAIL]: RailCategory.PLATFORM,
  [Rail.INTEGRATIONS]: RailCategory.PLATFORM,
  [Rail.DOCUMENTS]: RailCategory.PLATFORM,
  [Rail.DOCUMENT_MANAGEMENT]: RailCategory.PLATFORM,
  [Rail.DOCUMENT_SIGNING]: RailCategory.PLATFORM,
  [Rail.DOCUMENT_VAULT]: RailCategory.PLATFORM,
  [Rail.DATA_QUALITY]: RailCategory.PLATFORM,
  [Rail.LIMITS]: RailCategory.PLATFORM,
  [Rail.RETENTION]: RailCategory.PLATFORM,
  [Rail.SECRETS]: RailCategory.PLATFORM,
  [Rail.SLA_INCIDENT]: RailCategory.PLATFORM,
  [Rail.REFERENCE_DATA]: RailCategory.PLATFORM,
  [Rail.EVENTS]: RailCategory.PLATFORM,
  [Rail.NOTIFICATIONS]: RailCategory.PLATFORM,
  [Rail.NOTIFICATION_HUB]: RailCategory.PLATFORM,
  [Rail.NOTIFICATION_PREFERENCES]: RailCategory.PLATFORM,
  [Rail.ALERTING]: RailCategory.PLATFORM,

  // Observability
  [Rail.OBSERVABILITY]: RailCategory.OBSERVABILITY,
  [Rail.HEALTH]: RailCategory.OBSERVABILITY,
  [Rail.ANALYTICS]: RailCategory.OBSERVABILITY,
  [Rail.DASHBOARD]: RailCategory.OBSERVABILITY,
  [Rail.SEARCH]: RailCategory.OBSERVABILITY,
  [Rail.METADATA]: RailCategory.OBSERVABILITY,
  [Rail.TAXONOMY]: RailCategory.OBSERVABILITY,
  [Rail.WEBHOOKS]: RailCategory.OBSERVABILITY,
  [Rail.OMNI]: RailCategory.OBSERVABILITY,
};

// Build RAIL_INFO from CATEGORY_MAP
function toKebab(s: string): string {
  return s.toLowerCase().replace(/_/g, "-");
}

function toTitle(s: string): string {
  return s
    .split("_")
    .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
    .join(" ");
}

export const RAIL_INFO: Record<Rail, RailInfo> = Object.fromEntries(
  Object.values(Rail).map((rail) => [
    rail,
    {
      rail,
      category: CATEGORY_MAP[rail],
      name: `${toTitle(rail)} Rail`,
      description: `${toTitle(rail)} management and operations`,
      basePath: `/api/v1/${toKebab(rail)}`,
      version: "1.0.0",
    },
  ]),
) as Record<Rail, RailInfo>;

// Helper functions
export function getRailsByCategory(category: RailCategory): Rail[] {
  return Object.values(Rail).filter((rail) => CATEGORY_MAP[rail] === category);
}

export function getRailInfo(rail: Rail): RailInfo {
  return RAIL_INFO[rail];
}

export function getAllRails(): RailInfo[] {
  return Object.values(RAIL_INFO);
}

export function getCoreRails(): RailInfo[] {
  return getRailsByCategory(RailCategory.CORE_ISLAMIC_CONTRACTS).map(
    (r) => RAIL_INFO[r],
  );
}

export function getFinancialRails(): RailInfo[] {
  return getRailsByCategory(RailCategory.FINANCIAL).map((r) => RAIL_INFO[r]);
}

export function getGovernanceRails(): RailInfo[] {
  return getRailsByCategory(RailCategory.GOVERNANCE).map((r) => RAIL_INFO[r]);
}

export function getIslamicContractRails(): RailInfo[] {
  return getCoreRails();
}

export function getCapitalMarketRails(): RailInfo[] {
  return getRailsByCategory(RailCategory.CAPITAL_MARKETS).map(
    (r) => RAIL_INFO[r],
  );
}

export function getTakafulRails(): RailInfo[] {
  return getRailsByCategory(RailCategory.TAKAFUL).map((r) => RAIL_INFO[r]);
}

export function getTradeFinanceRails(): RailInfo[] {
  return getRailsByCategory(RailCategory.TRADE_FINANCE).map(
    (r) => RAIL_INFO[r],
  );
}

export function getPlatformRails(): RailInfo[] {
  return getRailsByCategory(RailCategory.PLATFORM).map((r) => RAIL_INFO[r]);
}
