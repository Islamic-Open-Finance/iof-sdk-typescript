/**
 * Contract Types and Utilities
 * Re-exports from contracts-core with SDK-specific helpers
 */

// Contract Type Enum
export enum ContractType {
  // Banking Contracts
  MURABAHA = "MURABAHA",
  IJARAH = "IJARAH",
  IJARAH_MUNTAHIA = "IJARAH_MUNTAHIA",
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
  UJRAH = "UJRAH",
  JUALAH = "JUALAH",

  // Takaful Contracts
  TAKAFUL_FAMILY = "TAKAFUL_FAMILY",
  TAKAFUL_GENERAL = "TAKAFUL_GENERAL",
  TAKAFUL_HEALTH = "TAKAFUL_HEALTH",
  RETAKAFUL = "RETAKAFUL",

  // Sukuk Contracts
  SUKUK_IJARAH = "SUKUK_IJARAH",
  SUKUK_MURABAHA = "SUKUK_MURABAHA",
  SUKUK_MUDARABAH = "SUKUK_MUDARABAH",
  SUKUK_MUSHARAKAH = "SUKUK_MUSHARAKAH",
  SUKUK_ISTISNA = "SUKUK_ISTISNA",
  SUKUK_SALAM = "SUKUK_SALAM",
  SUKUK_HYBRID = "SUKUK_HYBRID",
  SUKUK_WAKALAH = "SUKUK_WAKALAH",

  // Fund Contracts
  SHARIAH_EQUITY_FUND = "SHARIAH_EQUITY_FUND",
  SUKUK_FUND = "SUKUK_FUND",
  MONEY_MARKET_FUND = "MONEY_MARKET_FUND",
  MIXED_ASSET_FUND = "MIXED_ASSET_FUND",

  // Waqf Contracts
  WAQF_ENDOWMENT = "WAQF_ENDOWMENT",

  // Structured Products
  SYNDICATED_FACILITY = "SYNDICATED_FACILITY",
  SUKUK_PROGRAM = "SUKUK_PROGRAM",
}

// Contract Status
export enum ContractStatus {
  DRAFT = "DRAFT",
  PENDING_APPROVAL = "PENDING_APPROVAL",
  APPROVED = "APPROVED",
  ACTIVE = "ACTIVE",
  EXECUTED = "EXECUTED",
  COMPLETED = "COMPLETED",
  TERMINATED = "TERMINATED",
  CANCELLED = "CANCELLED",
  EXPIRED = "EXPIRED",
  DEFAULTED = "DEFAULTED",
}

// Contract Categories
export const CONTRACT_CATEGORIES = {
  BANKING: [
    ContractType.MURABAHA,
    ContractType.IJARAH,
    ContractType.IJARAH_MUNTAHIA,
    ContractType.MUSHARAKAH,
    ContractType.DIMINISHING_MUSHARAKAH,
    ContractType.MUDARABAH,
    ContractType.SALAM,
    ContractType.ISTISNA,
    ContractType.WAKALAH,
    ContractType.WADIAH,
    ContractType.QARD,
    ContractType.QARD_HASAN,
    ContractType.KAFALAH,
    ContractType.RAHNU,
    ContractType.HAWALAH,
    ContractType.UJRAH,
    ContractType.JUALAH,
  ],
  TAKAFUL: [
    ContractType.TAKAFUL_FAMILY,
    ContractType.TAKAFUL_GENERAL,
    ContractType.TAKAFUL_HEALTH,
    ContractType.RETAKAFUL,
  ],
  SUKUK: [
    ContractType.SUKUK_IJARAH,
    ContractType.SUKUK_MURABAHA,
    ContractType.SUKUK_MUDARABAH,
    ContractType.SUKUK_MUSHARAKAH,
    ContractType.SUKUK_ISTISNA,
    ContractType.SUKUK_SALAM,
    ContractType.SUKUK_HYBRID,
    ContractType.SUKUK_WAKALAH,
  ],
  FUNDS: [
    ContractType.SHARIAH_EQUITY_FUND,
    ContractType.SUKUK_FUND,
    ContractType.MONEY_MARKET_FUND,
    ContractType.MIXED_ASSET_FUND,
  ],
  WAQF: [ContractType.WAQF_ENDOWMENT],
  STRUCTURED: [ContractType.SYNDICATED_FACILITY, ContractType.SUKUK_PROGRAM],
} as const;

// Helper functions
export function getContractCategory(type: ContractType): string | undefined {
  for (const [category, types] of Object.entries(CONTRACT_CATEGORIES)) {
    if ((types as readonly ContractType[]).includes(type)) {
      return category;
    }
  }
  return undefined;
}

export function isDebtBased(type: ContractType): boolean {
  return [
    ContractType.MURABAHA,
    ContractType.SALAM,
    ContractType.ISTISNA,
    ContractType.QARD,
    ContractType.QARD_HASAN,
  ].includes(type);
}

export function isEquityBased(type: ContractType): boolean {
  return [
    ContractType.MUSHARAKAH,
    ContractType.DIMINISHING_MUSHARAKAH,
    ContractType.MUDARABAH,
  ].includes(type);
}

export function isTradable(type: ContractType): boolean {
  // Sukuk are generally tradable (except debt-based ones)
  if (type.startsWith("SUKUK_")) {
    return type !== ContractType.SUKUK_SALAM;
  }
  return false;
}
