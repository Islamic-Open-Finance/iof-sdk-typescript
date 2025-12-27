/**
 * Analytics API Client
 *
 * TypeScript SDK for Islamic Open Finance Analytics API
 */

export interface AnalyticsClient {
  contracts: ContractsAnalytics;
  shariah: ShariahAnalytics;
  reconciliation: ReconciliationAnalytics;
  usage: UsageAnalytics;
  billing: BillingAnalytics;
  custom: CustomAnalytics;
}

// Contracts Analytics
export interface ContractsAnalytics {
  getOverview(
    params: ContractsOverviewParams,
  ): Promise<ContractsOverviewResponse>;
  getExposure(
    params: ContractsExposureParams,
  ): Promise<ContractsExposureResponse>;
}

export interface ContractsOverviewParams {
  from_date: string;
  to_date: string;
  bank_id?: string;
  jurisdiction_id?: string;
  contract_type?: string;
  status?: string;
  currency?: string;
}

export interface ContractsOverviewResponse {
  items: ContractOverviewItem[];
  total_count: number;
}

export interface ContractOverviewItem {
  day: string;
  tenant_id: string;
  bank_id: string;
  jurisdiction_id: string;
  contract_type: string;
  status: string;
  total_contracts: number;
  total_principal: number;
  avg_principal: number;
  currency: string;
}

export interface ContractsExposureParams {
  bank_id?: string;
  jurisdiction_id?: string;
  contract_type?: string;
  currency?: string;
}

export interface ContractsExposureResponse {
  items: ContractExposureItem[];
  total_count: number;
}

export interface ContractExposureItem {
  tenant_id: string;
  bank_id: string;
  jurisdiction_id: string;
  contract_type: string;
  active_contracts: number;
  total_exposure: number;
  outstanding_amount: number;
  currency: string;
}

// Shariah Analytics
export interface ShariahAnalytics {
  getFlags(params: ShariahFlagsParams): Promise<ShariahFlagsResponse>;
  getHeatmap(params: ShariahHeatmapParams): Promise<ShariahHeatmapResponse>;
}

export interface ShariahFlagsParams {
  from_date: string;
  to_date: string;
  bank_id?: string;
  jurisdiction_id?: string;
  contract_type?: string;
  flag_type?: "breach" | "warning" | "info";
  status?: "open" | "resolved" | "dismissed";
}

export interface ShariahFlagsResponse {
  items: ShariahFlagItem[];
  total_count: number;
}

export interface ShariahFlagItem {
  day: string;
  tenant_id: string;
  bank_id: string;
  jurisdiction_id: string;
  contract_type: string;
  flag_type: string;
  status: string;
  total_flags: number;
  avg_severity: number;
}

export interface ShariahHeatmapParams {
  from_date: string;
  to_date: string;
  bank_id?: string;
}

export interface ShariahHeatmapResponse {
  heatmap: ShariahHeatmapItem[];
}

export interface ShariahHeatmapItem {
  contract_type: string;
  jurisdiction_id: string;
  severity_score: number;
  total_flags: number;
}

// Reconciliation Analytics
export interface ReconciliationAnalytics {
  getExceptions(
    params: ReconciliationExceptionsParams,
  ): Promise<ReconciliationExceptionsResponse>;
  getSummary(
    params: ReconciliationSummaryParams,
  ): Promise<ReconciliationSummaryResponse>;
}

export interface ReconciliationExceptionsParams {
  from_date: string;
  to_date: string;
  bank_id?: string;
  source_system?: string;
  exception_type?: "amount_mismatch" | "missing_entry" | "duplicate";
  status?: "pending" | "investigating" | "resolved" | "dismissed";
}

export interface ReconciliationExceptionsResponse {
  items: ReconciliationExceptionItem[];
  total_count: number;
}

export interface ReconciliationExceptionItem {
  day: string;
  tenant_id: string;
  bank_id: string;
  source_system: string;
  exception_type: string;
  status: string;
  total_exceptions: number;
  total_difference: number;
  avg_severity: number;
  currency: string;
}

export interface ReconciliationSummaryParams {
  bank_id?: string;
}

export interface ReconciliationSummaryResponse {
  tenant_id: string;
  bank_id: string;
  total_pending: number;
  total_investigating: number;
  total_resolved: number;
  total_dismissed: number;
  pending_amount: number;
  currency: string;
}

// Usage Analytics
export interface UsageAnalytics {
  getMetrics(params: UsageMetricsParams): Promise<UsageMetricsResponse>;
  getByRail(params: UsageByRailParams): Promise<UsageByRailResponse>;
}

export interface UsageMetricsParams {
  from_date: string;
  to_date: string;
  bank_id?: string;
  rail_name?: string;
  endpoint?: string;
  groupBy?: "day" | "hour" | "rail" | "endpoint";
}

export interface UsageMetricsResponse {
  items: UsageMetricItem[];
  total_count: number;
}

export interface UsageMetricItem {
  day?: string;
  tenant_id?: string;
  bank_id?: string;
  rail_name: string;
  endpoint?: string;
  http_method?: string;
  total_requests: number;
  successful_requests: number;
  failed_requests: number;
  avg_response_time: number;
  p95_response_time?: number;
}

export interface UsageByRailParams {
  from_date: string;
  to_date: string;
  bank_id?: string;
}

export interface UsageByRailResponse {
  items: UsageByRailItem[];
}

export interface UsageByRailItem {
  rail_name: string;
  total_requests: number;
  successful_requests: number;
  failed_requests: number;
  avg_response_time: number;
}

// Billing Analytics
export interface BillingAnalytics {
  getAggregates(
    params: BillingAggregatesParams,
  ): Promise<BillingAggregatesResponse>;
  getSummary(params: BillingSummaryParams): Promise<BillingSummaryResponse>;
  getUsageSummary(
    params: BillingUsageSummaryParams,
  ): Promise<BillingUsageSummaryResponse>;
}

export interface BillingAggregatesParams {
  from_date: string;
  to_date: string;
  bank_id?: string;
  sku_id?: string;
  rail_name?: string;
}

export interface BillingAggregatesResponse {
  items: BillingAggregateItem[];
  total_count: number;
}

export interface BillingAggregateItem {
  day: string;
  tenant_id: string;
  bank_id: string;
  sku_id: string;
  sku_name: string;
  rail_name: string;
  total_quantity: number;
  total_cost: number;
  currency: string;
}

export interface BillingSummaryParams {
  month: string;
  bank_id?: string;
}

export interface BillingSummaryResponse {
  month: string;
  tenant_id: string;
  bank_id: string;
  total_cost: number;
  total_api_calls: number;
  total_contracts: number;
  currency: string;
  status: "draft" | "invoiced" | "paid";
}

export interface BillingUsageSummaryParams {
  bank_id?: string;
  billing_period?: string;
}

export interface BillingUsageSummaryResponse {
  tenant_id: string;
  bank_id: string;
  billing_period: string;
  total_api_calls: number;
  total_contracts: number;
  total_cost: number;
  currency: string;
  plan_tier: string;
}

// Custom Analytics
export interface CustomAnalytics {
  execute(params: CustomAnalyticsParams): Promise<CustomAnalyticsResponse>;
}

export interface CustomAnalyticsParams {
  view_name:
    | "vw_contracts_overview"
    | "vw_shariah_flags_daily"
    | "vw_reconciliation_exceptions"
    | "vw_usage_by_tenant_and_rail"
    | "vw_billing_aggregates";
  filters?: Record<string, any>;
  group_by?: string[];
  order_by?: string;
  limit?: number;
}

export interface CustomAnalyticsResponse {
  items: any[];
  total_count: number;
}
