/**
 * Islamic Open Finance SDK
 * TypeScript SDK for the IOF Rail API — 125 rails across 12 categories
 */

export { IOFClient, HttpClient, ApiException } from "./client.js";
export type * from "./analytics.js";
export type {
  ClientConfig,
  RequestOptions,
  PaginatedResponse,
  ApiError,
  // Entity types
  Contract,
  Jurisdiction,
  Consent,
  Customer,
  Case,
  ZakatCalculation,
  ReconciliationJob,
  RoutingRule,
  Message,
  Obligation,
  ClearingCycle,
  TreasuryAccount,
  LiquidityLadder,
  GapAnalysis,
  Exposure,
  RiskLimit,
  StressTestResult,
  ConcentrationAnalysis,
  Mandate,
  Position,
  PerformanceMetrics,
  LegalTemplate,
  UnderwritingProposal,
  UnderwritingDecision,
  CompliancePolicy,
  ComplianceCheck,
  Committee,
  GovernanceDecision,
  EventSubscription,
  Event,
  Notification,
  NotificationTemplate,
  // Reporting types
  ReportDefinition,
  CreateReportDefinitionRequest,
  Report,
  GenerateReportRequest,
  Dashboard,
  AnalyticsMetrics,
  AnalyticsTrends,
  // Search types
  SearchHit,
  SearchResponse,
  MultiSearchResponse,
  SearchContractsParams,
  SearchPartiesParams,
  SearchCasesParams,
  SearchSkusParams,
  SearchEndpointsParams,
  GlobalSearchParams,
  ContractSearchResult,
  PartySearchResult,
  CaseSearchResult,
  SkuSearchResult,
  EndpointSearchResult,
  SearchStatsResponse,
  SearchHealthResponse,
  SearchIndexName,
  ReindexResponse,
  // Settlement Engine (moat namespace)
  Settlement,
  SettlementMode,
  SettlementStatus,
  SettlementStatusValue,
  SettlementParty,
  SettlementConfirmRequest,
  SettlementResult,
  SettlementNettingRequest,
  SettlementNettingResult,
  // Evidence Engine (moat namespace)
  EvidencePack,
  EvidenceFormat,
  EvidenceExportRequest,
  EvidenceVerifyRequest,
  EvidenceVerifyResult,
  EvidenceControl,
  EvidenceControlCatalogue,
  ComplianceFramework,
} from "./client.js";

// Rail types and utilities
export type { RailInfo } from "./rails.js";
export {
  Rail,
  RailCategory,
  RAIL_INFO,
  getRailsByCategory,
  getRailInfo,
  getAllRails,
  getCoreRails,
  getFinancialRails,
  getGovernanceRails,
  getIslamicContractRails,
  getCapitalMarketRails,
  getTakafulRails,
  getTradeFinanceRails,
  getPlatformRails,
} from "./rails.js";

// Re-export for convenience
export { createIOFClient } from "./factory.js";
