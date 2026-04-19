/**
 * Islamic Open Finance SDK Client
 * TypeScript client for the IOF Rail API
 */

// ============================================================================
// Types
// ============================================================================

export interface ClientConfig {
  baseUrl: string;
  apiKey?: string;
  accessToken?: string;
  tenantId?: string;
  timeout?: number;
  retries?: number;
  onError?: (error: ApiError) => void;
}

export interface RequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean | string[] | undefined>;
  signal?: AbortSignal;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  status: number;
}

export class ApiException extends Error {
  constructor(
    public readonly error: ApiError,
    public readonly status: number,
  ) {
    super(error.message);
    this.name = "ApiException";
  }
}

// ============================================================================
// HTTP Client
// ============================================================================

export class HttpClient {
  private baseUrl: string;
  private headers: Record<string, string>;
  private timeout: number;
  private retries: number;
  private onError?: (error: ApiError) => void;

  constructor(config: ClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, "");
    this.timeout = config.timeout || 30000;
    this.retries = config.retries || 3;
    this.onError = config.onError;

    this.headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    if (config.apiKey) {
      this.headers["X-Api-Key"] = config.apiKey;
    }

    if (config.accessToken) {
      this.headers["Authorization"] = `Bearer ${config.accessToken}`;
    }

    if (config.tenantId) {
      this.headers["X-Tenant-Id"] = config.tenantId;
    }
  }

  setAccessToken(token: string): void {
    this.headers["Authorization"] = `Bearer ${token}`;
  }

  setApiKey(key: string): void {
    this.headers["X-Api-Key"] = key;
  }

  setTenantId(tenantId: string): void {
    this.headers["X-Tenant-Id"] = tenantId;
  }

  private buildUrl(
    path: string,
    params?: Record<string, string | number | boolean | string[] | undefined>,
  ): string {
    const url = new URL(`${this.baseUrl}${path}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          if (Array.isArray(value)) {
            value.forEach((v) => url.searchParams.append(key, String(v)));
          } else {
            url.searchParams.append(key, String(value));
          }
        }
      });
    }

    return url.toString();
  }

  private async request<T>(
    method: string,
    path: string,
    options?: RequestOptions & { body?: unknown },
  ): Promise<T> {
    const url = this.buildUrl(path, options?.params);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    const headers = {
      ...this.headers,
      ...options?.headers,
    };

    let lastError: Error | null = null;

    for (let attempt = 0; attempt < this.retries; attempt++) {
      try {
        const response = await fetch(url, {
          method,
          headers,
          body: options?.body ? JSON.stringify(options.body) : undefined,
          signal: options?.signal || controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorBody = (await response.json().catch(() => ({}))) as {
            error?: {
              code?: string;
              message?: string;
              details?: Record<string, unknown>;
            };
          };
          const apiError: ApiError = {
            code: errorBody.error?.code || "UNKNOWN_ERROR",
            message: errorBody.error?.message || response.statusText,
            details: errorBody.error?.details,
            status: response.status,
          };

          if (this.onError) {
            this.onError(apiError);
          }

          throw new ApiException(apiError, response.status);
        }

        if (response.status === 204) {
          return undefined as T;
        }

        return (await response.json()) as T;
      } catch (error) {
        lastError = error as Error;

        // Don't retry on client errors (4xx)
        if (
          error instanceof ApiException &&
          error.status >= 400 &&
          error.status < 500
        ) {
          throw error;
        }

        // Don't retry on abort
        if (error instanceof Error && error.name === "AbortError") {
          throw error;
        }

        // Wait before retrying
        if (attempt < this.retries - 1) {
          await new Promise((resolve) =>
            setTimeout(resolve, Math.pow(2, attempt) * 1000),
          );
        }
      }
    }

    clearTimeout(timeoutId);
    throw lastError;
  }

  async get<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>("GET", path, options);
  }

  async post<T>(
    path: string,
    body?: unknown,
    options?: RequestOptions,
  ): Promise<T> {
    return this.request<T>("POST", path, { ...options, body });
  }

  async put<T>(
    path: string,
    body?: unknown,
    options?: RequestOptions,
  ): Promise<T> {
    return this.request<T>("PUT", path, { ...options, body });
  }

  async patch<T>(
    path: string,
    body?: unknown,
    options?: RequestOptions,
  ): Promise<T> {
    return this.request<T>("PATCH", path, { ...options, body });
  }

  async delete<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>("DELETE", path, options);
  }
}

// ============================================================================
// IOF Client
// ============================================================================

export class IOFClient {
  readonly http: HttpClient;

  constructor(config: ClientConfig) {
    this.http = new HttpClient(config);
  }

  // Contracts
  get contracts() {
    return new ContractsApi(this.http);
  }

  // Jurisdictions
  get jurisdictions() {
    return new JurisdictionsApi(this.http);
  }

  // Access & Consent
  get consents() {
    return new ConsentsApi(this.http);
  }

  // KYC
  get kyc() {
    return new KycApi(this.http);
  }

  // Cases
  get cases() {
    return new CasesApi(this.http);
  }

  // Zakat
  get zakat() {
    return new ZakatApi(this.http);
  }

  // Reconciliation
  get reconciliation() {
    return new ReconciliationApi(this.http);
  }

  // Routing
  get routing() {
    return new RoutingApi(this.http);
  }

  // Messages
  get messages() {
    return new MessagesApi(this.http);
  }

  // Clearing
  get clearing() {
    return new ClearingApi(this.http);
  }

  // Treasury
  get treasury() {
    return new TreasuryApi(this.http);
  }

  // Risk
  get risk() {
    return new RiskApi(this.http);
  }

  // Portfolio
  get portfolio() {
    return new PortfolioApi(this.http);
  }

  // Legal
  get legal() {
    return new LegalApi(this.http);
  }

  // Underwriting
  get underwriting() {
    return new UnderwritingApi(this.http);
  }

  // Compliance
  get compliance() {
    return new ComplianceApi(this.http);
  }

  // Governance
  get governance() {
    return new GovernanceApi(this.http);
  }

  // Events
  get events() {
    return new EventsApi(this.http);
  }

  // Notifications
  get notifications() {
    return new NotificationsApi(this.http);
  }

  // Search
  get search() {
    return new SearchApi(this.http);
  }

  // Reporting
  get reporting() {
    return new ReportingApi(this.http);
  }

  // AML/CFT
  get aml() {
    return new AmlApi(this.http);
  }

  // Privacy & Consent (GDPR/CCPA)
  get privacyConsent() {
    return new PrivacyConsentApi(this.http);
  }

  // Developer & Integration
  get developer() {
    return new DeveloperApi(this.http);
  }

  // Partners & Embedded Finance
  get partners() {
    return new PartnersApi(this.http);
  }

  // Disputes & Collections
  get disputes() {
    return new DisputesApi(this.http);
  }

  // Observability
  get observability() {
    return new ObservabilityApi(this.http);
  }

  // Settlement Engine — moat namespace (24x7x365 DvP/FOP/RVP/DFP, AAOIFI SS-1/8/10/17/21/30,
  // CSDR Art. 7, ribawi-pair netting). Reclaims 60-140 bps per corridor.
  get settlement() {
    return new SettlementApi(this.http);
  }

  // Evidence Engine — moat namespace (signed compliance pack, 47/54 controls across
  // SOC 2 / ISO 27001 / AAOIFI / GDPR / PSD2 / IFSB / ISO 20022, SHA-256 Merkle + HMAC,
  // one-call verification). Reclaims 30-55 bps on audit + re-papering.
  get evidence() {
    return new EvidenceApi(this.http);
  }
}

// ============================================================================
// API Classes
// ============================================================================

class ContractsApi {
  constructor(private http: HttpClient) {}

  async list(params?: {
    page?: number;
    limit?: number;
    status?: string;
    type?: string;
  }) {
    return this.http.get<PaginatedResponse<Contract>>("/api/v1/contracts", {
      params,
    });
  }

  async get(contractId: string) {
    return this.http.get<Contract>(`/api/v1/contracts/${contractId}`);
  }

  async create(data: CreateContractRequest) {
    return this.http.post<Contract>("/api/v1/contracts", data);
  }

  async update(contractId: string, data: UpdateContractRequest) {
    return this.http.patch<Contract>(`/api/v1/contracts/${contractId}`, data);
  }

  async execute(contractId: string) {
    return this.http.post<Contract>(`/api/v1/contracts/${contractId}/execute`);
  }

  async terminate(contractId: string, reason: string) {
    return this.http.post<Contract>(
      `/api/v1/contracts/${contractId}/terminate`,
      { reason },
    );
  }

  async validate(data: CreateContractRequest) {
    return this.http.post<ValidationResult>("/api/v1/contracts/validate", data);
  }
}

class JurisdictionsApi {
  constructor(private http: HttpClient) {}

  async list() {
    return this.http.get<Jurisdiction[]>("/api/v1/jurisdictions");
  }

  async get(jurisdictionId: string) {
    return this.http.get<Jurisdiction>(
      `/api/v1/jurisdictions/${jurisdictionId}`,
    );
  }
}

class ConsentsApi {
  constructor(private http: HttpClient) {}

  async list(params?: { page?: number; limit?: number; status?: string }) {
    return this.http.get<PaginatedResponse<Consent>>(
      "/api/v1/access/consents",
      { params },
    );
  }

  async create(data: CreateConsentRequest) {
    return this.http.post<Consent>("/api/v1/access/consents", data);
  }

  async get(consentId: string) {
    return this.http.get<Consent>(`/api/v1/access/consents/${consentId}`);
  }

  async revoke(consentId: string) {
    return this.http.post<Consent>(
      `/api/v1/access/consents/${consentId}/revoke`,
    );
  }
}

class KycApi {
  constructor(private http: HttpClient) {}

  // Legacy customer methods (for backwards compatibility)
  async listCustomers(params?: { page?: number; limit?: number }) {
    return this.http.get<PaginatedResponse<Customer>>("/api/v1/kyc/customers", {
      params,
    });
  }

  async createCustomer(data: CreateCustomerRequest) {
    return this.http.post<Customer>("/api/v1/kyc/customers", data);
  }

  async getCustomer(customerId: string) {
    return this.http.get<Customer>(`/api/v1/kyc/customers/${customerId}`);
  }

  async verifyCustomer(customerId: string) {
    return this.http.post<Customer>(
      `/api/v1/kyc/customers/${customerId}/verify`,
    );
  }

  async screenCustomer(customerId: string) {
    return this.http.post<ScreeningResult>(
      `/api/v1/kyc/customers/${customerId}/screen`,
    );
  }

  // Enhanced KYC Subject methods
  async listSubjects(params?: {
    subjectType?: string;
    kycStatus?: string;
    riskBand?: string;
    country?: string;
    pep?: boolean;
    sanctioned?: boolean;
  }) {
    return this.http.get<{ data: any[]; count: number }>(
      "/api/v1/kyc/subjects",
      { params },
    );
  }

  async createSubject(data: any) {
    return this.http.post<any>("/api/v1/kyc/subjects", data);
  }

  async getSubject(subjectId: string) {
    return this.http.get<any>(`/api/v1/kyc/subjects/${subjectId}`);
  }

  async updateSubject(subjectId: string, data: any) {
    return this.http.patch<any>(`/api/v1/kyc/subjects/${subjectId}`, data);
  }

  // KYC Profile methods
  async listProfiles(params?: {
    kycStatus?: string;
    riskBand?: string;
    jurisdictionId?: string;
  }) {
    return this.http.get<{ data: any[]; count: number }>(
      "/api/v1/kyc/profiles",
      { params },
    );
  }

  async createProfile(data: any) {
    return this.http.post<any>("/api/v1/kyc/profiles", data);
  }

  async getProfile(profileId: string) {
    return this.http.get<any>(`/api/v1/kyc/profiles/${profileId}`);
  }

  async updateProfile(profileId: string, data: any) {
    return this.http.patch<any>(`/api/v1/kyc/profiles/${profileId}`, data);
  }

  // KYC Verification methods
  async listVerifications(params?: {
    subjectId?: string;
    verificationType?: string;
    status?: string;
  }) {
    return this.http.get<{ data: any[]; count: number }>(
      "/api/v1/kyc/verifications",
      { params },
    );
  }

  async createVerification(data: any) {
    return this.http.post<any>("/api/v1/kyc/verifications", data);
  }

  async getVerification(verificationId: string) {
    return this.http.get<any>(`/api/v1/kyc/verifications/${verificationId}`);
  }

  async updateVerification(verificationId: string, data: any) {
    return this.http.patch<any>(
      `/api/v1/kyc/verifications/${verificationId}`,
      data,
    );
  }
}

class CasesApi {
  constructor(private http: HttpClient) {}

  async list(params?: { page?: number; limit?: number; status?: string }) {
    return this.http.get<PaginatedResponse<Case>>("/api/v1/cases", { params });
  }

  async create(data: CreateCaseRequest) {
    return this.http.post<Case>("/api/v1/cases", data);
  }

  async get(caseId: string) {
    return this.http.get<Case>(`/api/v1/cases/${caseId}`);
  }

  async update(caseId: string, data: UpdateCaseRequest) {
    return this.http.patch<Case>(`/api/v1/cases/${caseId}`, data);
  }

  async close(caseId: string, resolution: string) {
    return this.http.post<Case>(`/api/v1/cases/${caseId}/close`, {
      resolution,
    });
  }
}

class ZakatApi {
  constructor(private http: HttpClient) {}

  // Legacy calculation methods (for backwards compatibility)
  async calculate(data: ZakatCalculationRequest) {
    return this.http.post<ZakatCalculation>("/api/v1/zakat/calculate", data);
  }

  async listCalculations(params?: { page?: number; limit?: number }) {
    return this.http.get<PaginatedResponse<ZakatCalculation>>(
      "/api/v1/zakat/calculations",
      { params },
    );
  }

  async getCalculation(calculationId: string) {
    return this.http.get<ZakatCalculation>(
      `/api/v1/zakat/calculations/${calculationId}`,
    );
  }

  // Enhanced Zakat Profile methods
  async listProfiles(params?: { subjectType?: string; subjectId?: string }) {
    return this.http.get<{ data: any[]; count: number }>(
      "/api/v1/zakat/profiles",
      { params },
    );
  }

  async createProfile(data: any) {
    return this.http.post<any>("/api/v1/zakat/profiles", data);
  }

  async getProfile(profileId: string) {
    return this.http.get<any>(`/api/v1/zakat/profiles/${profileId}`);
  }

  async updateProfile(profileId: string, data: any) {
    return this.http.patch<any>(`/api/v1/zakat/profiles/${profileId}`, data);
  }

  // Zakat Position methods
  async listPositions(params?: {
    profileId?: string;
    assetType?: string;
    shariahCompliant?: boolean;
  }) {
    return this.http.get<{ data: any[]; count: number }>(
      "/api/v1/zakat/positions",
      { params },
    );
  }

  async createPosition(data: any) {
    return this.http.post<any>("/api/v1/zakat/positions", data);
  }

  async getPosition(positionId: string) {
    return this.http.get<any>(`/api/v1/zakat/positions/${positionId}`);
  }

  async updatePosition(positionId: string, data: any) {
    return this.http.patch<any>(`/api/v1/zakat/positions/${positionId}`, data);
  }

  // Enhanced Zakat Calculation methods
  async createCalculation(data: any) {
    return this.http.post<any>("/api/v1/zakat/calculations", data);
  }

  async updateCalculation(calculationId: string, data: any) {
    return this.http.patch<any>(
      `/api/v1/zakat/calculations/${calculationId}`,
      data,
    );
  }

  // Zakat Instruction methods
  async listInstructions(params?: { calculationId?: string; status?: string }) {
    return this.http.get<{ data: any[]; count: number }>(
      "/api/v1/zakat/instructions",
      { params },
    );
  }

  async createInstruction(data: any) {
    return this.http.post<any>("/api/v1/zakat/instructions", data);
  }

  async getInstruction(instructionId: string) {
    return this.http.get<any>(`/api/v1/zakat/instructions/${instructionId}`);
  }

  async updateInstruction(instructionId: string, data: any) {
    return this.http.patch<any>(
      `/api/v1/zakat/instructions/${instructionId}`,
      data,
    );
  }

  // Impact Tag methods
  async listImpactTags(params?: { category?: string }) {
    return this.http.get<{ data: any[]; count: number }>(
      "/api/v1/zakat/impact-tags",
      { params },
    );
  }

  async createImpactTag(data: any) {
    return this.http.post<any>("/api/v1/zakat/impact-tags", data);
  }

  async getImpactTag(tagId: string) {
    return this.http.get<any>(`/api/v1/zakat/impact-tags/${tagId}`);
  }

  async updateImpactTag(tagId: string, data: any) {
    return this.http.patch<any>(`/api/v1/zakat/impact-tags/${tagId}`, data);
  }
}

class ReconciliationApi {
  constructor(private http: HttpClient) {}

  // Legacy job methods (for backwards compatibility)
  async listJobs(params?: { page?: number; limit?: number }) {
    return this.http.get<PaginatedResponse<ReconciliationJob>>(
      "/api/v1/reconciliation/jobs",
      { params },
    );
  }

  async createJob(data: CreateReconciliationJobRequest) {
    return this.http.post<ReconciliationJob>(
      "/api/v1/reconciliation/jobs",
      data,
    );
  }

  async getJob(jobId: string) {
    return this.http.get<ReconciliationJob>(
      `/api/v1/reconciliation/jobs/${jobId}`,
    );
  }

  async runJob(jobId: string) {
    return this.http.post<ReconciliationJob>(
      `/api/v1/reconciliation/jobs/${jobId}/run`,
    );
  }

  // Enhanced Reconciliation Run methods
  async listRuns(params?: {
    scopeType?: string;
    scopeId?: string;
    status?: string;
  }) {
    return this.http.get<{ data: any[]; count: number }>(
      "/api/v1/reconciliation/runs",
      { params },
    );
  }

  async createRun(data: any) {
    return this.http.post<any>("/api/v1/reconciliation/runs", data);
  }

  async getRun(runId: string) {
    return this.http.get<any>(`/api/v1/reconciliation/runs/${runId}`);
  }

  async updateRun(runId: string, data: any) {
    return this.http.patch<any>(`/api/v1/reconciliation/runs/${runId}`, data);
  }

  async cancelRun(runId: string) {
    return this.http.post<any>(`/api/v1/reconciliation/runs/${runId}/cancel`);
  }

  // Reconciliation Match methods
  async listMatches(params?: { runId?: string; matchStatus?: string }) {
    return this.http.get<{ data: any[]; count: number }>(
      "/api/v1/reconciliation/matches",
      { params },
    );
  }

  async createMatch(data: any) {
    return this.http.post<any>("/api/v1/reconciliation/matches", data);
  }

  async getMatch(matchId: string) {
    return this.http.get<any>(`/api/v1/reconciliation/matches/${matchId}`);
  }

  // Reconciliation Exception methods
  async listExceptions(params?: {
    runId?: string;
    exceptionType?: string;
    severity?: string;
    resolved?: boolean;
  }) {
    return this.http.get<{ data: any[]; count: number }>(
      "/api/v1/reconciliation/exceptions",
      { params },
    );
  }

  async createException(data: any) {
    return this.http.post<any>("/api/v1/reconciliation/exceptions", data);
  }

  async getException(exceptionId: string) {
    return this.http.get<any>(
      `/api/v1/reconciliation/exceptions/${exceptionId}`,
    );
  }

  async updateException(exceptionId: string, data: any) {
    return this.http.patch<any>(
      `/api/v1/reconciliation/exceptions/${exceptionId}`,
      data,
    );
  }

  // Contract reconciliation status
  async getContractStatus(contractId: string) {
    return this.http.get<any>(
      `/api/v1/reconciliation/contracts/${contractId}/status`,
    );
  }
}

class RoutingApi {
  constructor(private http: HttpClient) {}

  async listRules(params?: { page?: number; limit?: number }) {
    return this.http.get<PaginatedResponse<RoutingRule>>(
      "/api/v1/routing/rules",
      { params },
    );
  }

  async createRule(data: CreateRoutingRuleRequest) {
    return this.http.post<RoutingRule>("/api/v1/routing/rules", data);
  }

  async route(data: RouteRequest) {
    return this.http.post<RouteResult>("/api/v1/routing/route", data);
  }
}

class MessagesApi {
  constructor(private http: HttpClient) {}

  async list(params?: { page?: number; limit?: number; status?: string }) {
    return this.http.get<PaginatedResponse<Message>>("/api/v1/messages", {
      params,
    });
  }

  async send(data: SendMessageRequest) {
    return this.http.post<Message>("/api/v1/messages", data);
  }

  async get(messageId: string) {
    return this.http.get<Message>(`/api/v1/messages/${messageId}`);
  }

  async acknowledge(messageId: string) {
    return this.http.post<Message>(`/api/v1/messages/${messageId}/acknowledge`);
  }
}

class ClearingApi {
  constructor(private http: HttpClient) {}

  async listObligations(params?: { page?: number; limit?: number }) {
    return this.http.get<PaginatedResponse<Obligation>>(
      "/api/v1/clearing/obligations",
      { params },
    );
  }

  async createObligation(data: CreateObligationRequest) {
    return this.http.post<Obligation>("/api/v1/clearing/obligations", data);
  }

  async listCycles(params?: { page?: number; limit?: number }) {
    return this.http.get<PaginatedResponse<ClearingCycle>>(
      "/api/v1/clearing/cycles",
      { params },
    );
  }

  async createCycle(data: CreateCycleRequest) {
    return this.http.post<ClearingCycle>("/api/v1/clearing/cycles", data);
  }

  async settle(cycleId: string) {
    return this.http.post<ClearingCycle>(
      `/api/v1/clearing/cycles/${cycleId}/settle`,
    );
  }
}

class TreasuryApi {
  constructor(private http: HttpClient) {}

  async listAccounts(params?: { page?: number; limit?: number }) {
    return this.http.get<PaginatedResponse<TreasuryAccount>>(
      "/api/v1/treasury/accounts",
      { params },
    );
  }

  async createAccount(data: CreateTreasuryAccountRequest) {
    return this.http.post<TreasuryAccount>("/api/v1/treasury/accounts", data);
  }

  async getLiquidityLadder() {
    return this.http.get<LiquidityLadder>("/api/v1/treasury/liquidity-ladder");
  }

  async getGapAnalysis() {
    return this.http.get<GapAnalysis>("/api/v1/treasury/gap-analysis");
  }
}

class RiskApi {
  constructor(private http: HttpClient) {}

  async listExposures(params?: { page?: number; limit?: number }) {
    return this.http.get<PaginatedResponse<Exposure>>(
      "/api/v1/risk/exposures",
      { params },
    );
  }

  async createExposure(data: CreateExposureRequest) {
    return this.http.post<Exposure>("/api/v1/risk/exposures", data);
  }

  async listLimits(params?: { page?: number; limit?: number }) {
    return this.http.get<PaginatedResponse<RiskLimit>>("/api/v1/risk/limits", {
      params,
    });
  }

  async runStressTest(data: StressTestRequest) {
    return this.http.post<StressTestResult>("/api/v1/risk/stress-tests", data);
  }

  async getConcentration() {
    return this.http.get<ConcentrationAnalysis>("/api/v1/risk/concentration");
  }
}

class PortfolioApi {
  constructor(private http: HttpClient) {}

  async listMandates(params?: { page?: number; limit?: number }) {
    return this.http.get<PaginatedResponse<Mandate>>(
      "/api/v1/portfolio/mandates",
      { params },
    );
  }

  async createMandate(data: CreateMandateRequest) {
    return this.http.post<Mandate>("/api/v1/portfolio/mandates", data);
  }

  async getMandate(mandateId: string) {
    return this.http.get<Mandate>(`/api/v1/portfolio/mandates/${mandateId}`);
  }

  async getPositions(mandateId: string) {
    return this.http.get<PaginatedResponse<Position>>(
      `/api/v1/portfolio/mandates/${mandateId}/positions`,
    );
  }

  async getPerformance(mandateId: string) {
    return this.http.get<PerformanceMetrics>(
      `/api/v1/portfolio/mandates/${mandateId}/performance`,
    );
  }
}

class LegalApi {
  constructor(private http: HttpClient) {}

  async listTemplates(params?: { page?: number; limit?: number }) {
    return this.http.get<PaginatedResponse<LegalTemplate>>(
      "/api/v1/legal/templates",
      { params },
    );
  }

  async createTemplate(data: CreateLegalTemplateRequest) {
    return this.http.post<LegalTemplate>("/api/v1/legal/templates", data);
  }

  async generateDocument(data: GenerateDocumentRequest) {
    return this.http.post<GeneratedDocument>(
      "/api/v1/legal/documents/generate",
      data,
    );
  }
}

class UnderwritingApi {
  constructor(private http: HttpClient) {}

  async listProposals(params?: { page?: number; limit?: number }) {
    return this.http.get<PaginatedResponse<UnderwritingProposal>>(
      "/api/v1/underwriting/proposals",
      { params },
    );
  }

  async createProposal(data: CreateUnderwritingProposalRequest) {
    return this.http.post<UnderwritingProposal>(
      "/api/v1/underwriting/proposals",
      data,
    );
  }

  async submitForDecision(proposalId: string) {
    return this.http.post<UnderwritingDecision>(
      `/api/v1/underwriting/proposals/${proposalId}/submit`,
    );
  }
}

class ComplianceApi {
  constructor(private http: HttpClient) {}

  async listPolicies(params?: { page?: number; limit?: number }) {
    return this.http.get<PaginatedResponse<CompliancePolicy>>(
      "/api/v1/compliance/policies",
      { params },
    );
  }

  async createPolicy(data: CreateCompliancePolicyRequest) {
    return this.http.post<CompliancePolicy>(
      "/api/v1/compliance/policies",
      data,
    );
  }

  async runCheck(data: ComplianceCheckRequest) {
    return this.http.post<ComplianceCheck>("/api/v1/compliance/checks", data);
  }

  async listChecks(params?: { page?: number; limit?: number }) {
    return this.http.get<PaginatedResponse<ComplianceCheck>>(
      "/api/v1/compliance/checks",
      { params },
    );
  }
}

class GovernanceApi {
  constructor(private http: HttpClient) {}

  async listCommittees(params?: { page?: number; limit?: number }) {
    return this.http.get<PaginatedResponse<Committee>>(
      "/api/v1/governance/committees",
      { params },
    );
  }

  async createCommittee(data: CreateCommitteeRequest) {
    return this.http.post<Committee>("/api/v1/governance/committees", data);
  }

  async listDecisions(params?: { page?: number; limit?: number }) {
    return this.http.get<PaginatedResponse<GovernanceDecision>>(
      "/api/v1/governance/decisions",
      { params },
    );
  }

  async createDecision(data: CreateDecisionRequest) {
    return this.http.post<GovernanceDecision>(
      "/api/v1/governance/decisions",
      data,
    );
  }
}

class EventsApi {
  constructor(private http: HttpClient) {}

  async listSubscriptions(params?: { page?: number; limit?: number }) {
    return this.http.get<PaginatedResponse<EventSubscription>>(
      "/api/v1/events/subscriptions",
      { params },
    );
  }

  async createSubscription(data: CreateEventSubscriptionRequest) {
    return this.http.post<EventSubscription>(
      "/api/v1/events/subscriptions",
      data,
    );
  }

  async listEvents(params?: { page?: number; limit?: number }) {
    return this.http.get<PaginatedResponse<Event>>("/api/v1/events", {
      params,
    });
  }

  async publish(data: PublishEventRequest) {
    return this.http.post<Event>("/api/v1/events/publish", data);
  }
}

class NotificationsApi {
  constructor(private http: HttpClient) {}

  async list(params?: { page?: number; limit?: number }) {
    return this.http.get<PaginatedResponse<Notification>>(
      "/api/v1/notifications",
      { params },
    );
  }

  async send(data: SendNotificationRequest) {
    return this.http.post<Notification>("/api/v1/notifications", data);
  }

  async listTemplates(params?: { page?: number; limit?: number }) {
    return this.http.get<PaginatedResponse<NotificationTemplate>>(
      "/api/v1/notifications/templates",
      { params },
    );
  }

  async createTemplate(data: CreateNotificationTemplateRequest) {
    return this.http.post<NotificationTemplate>(
      "/api/v1/notifications/templates",
      data,
    );
  }
}

class ReportingApi {
  constructor(private http: HttpClient) {}

  async listDefinitions(params?: {
    page?: number;
    limit?: number;
    type?: string;
  }) {
    return this.http.get<PaginatedResponse<ReportDefinition>>(
      "/api/v1/reporting/definitions",
      { params },
    );
  }

  async createDefinition(data: CreateReportDefinitionRequest) {
    return this.http.post<ReportDefinition>(
      "/api/v1/reporting/definitions",
      data,
    );
  }

  async getDefinition(definitionId: string) {
    return this.http.get<ReportDefinition>(
      `/api/v1/reporting/definitions/${definitionId}`,
    );
  }

  async generate(data: GenerateReportRequest) {
    return this.http.post<Report>("/api/v1/reporting/generate", data);
  }

  async listReports(params?: {
    page?: number;
    limit?: number;
    type?: string;
    status?: string;
  }) {
    return this.http.get<PaginatedResponse<Report>>(
      "/api/v1/reporting/reports",
      { params },
    );
  }

  async getReport(reportId: string) {
    return this.http.get<Report>(`/api/v1/reporting/reports/${reportId}`);
  }

  async downloadReport(reportId: string) {
    return this.http.get<Blob>(
      `/api/v1/reporting/reports/${reportId}/download`,
    );
  }

  async listDashboards(params?: { page?: number; limit?: number }) {
    return this.http.get<PaginatedResponse<Dashboard>>(
      "/api/v1/reporting/dashboards",
      { params },
    );
  }

  async getMetrics(params?: { periodStart?: string; periodEnd?: string }) {
    return this.http.get<AnalyticsMetrics>(
      "/api/v1/reporting/analytics/metrics",
      { params },
    );
  }

  async getTrends(params?: { metric?: string; period?: string }) {
    return this.http.get<AnalyticsTrends>(
      "/api/v1/reporting/analytics/trends",
      { params },
    );
  }
}

class SearchApi {
  constructor(private http: HttpClient) {}

  async contracts(params?: SearchContractsParams) {
    return this.http.get<SearchResponse<ContractSearchResult>>(
      "/api/v1/search/contracts",
      {
        params: params as RequestOptions["params"],
      },
    );
  }

  async parties(params?: SearchPartiesParams) {
    return this.http.get<SearchResponse<PartySearchResult>>(
      "/api/v1/search/parties",
      {
        params: params as RequestOptions["params"],
      },
    );
  }

  async cases(params?: SearchCasesParams) {
    return this.http.get<SearchResponse<CaseSearchResult>>(
      "/api/v1/search/cases",
      {
        params: params as RequestOptions["params"],
      },
    );
  }

  async skus(params?: SearchSkusParams) {
    return this.http.get<SearchResponse<SkuSearchResult>>(
      "/api/v1/search/skus",
      {
        params: params as RequestOptions["params"],
      },
    );
  }

  async endpoints(params?: SearchEndpointsParams) {
    return this.http.get<SearchResponse<EndpointSearchResult>>(
      "/api/v1/search/endpoints",
      {
        params: params as RequestOptions["params"],
      },
    );
  }

  async global(params: GlobalSearchParams) {
    return this.http.get<MultiSearchResponse>("/api/v1/search/global", {
      params: params as unknown as RequestOptions["params"],
    });
  }

  async stats() {
    return this.http.get<SearchStatsResponse>("/api/v1/search/stats");
  }

  async health() {
    return this.http.get<SearchHealthResponse>("/api/v1/search/health");
  }

  async reindex(index: SearchIndexName) {
    return this.http.post<ReindexResponse>(`/api/v1/search/reindex/${index}`);
  }
}

// ============================================================================
// NEW RAIL API CLASSES
// ============================================================================

class AmlApi {
  constructor(private http: HttpClient) {}

  // AML Rules
  async listRules(params?: {
    jurisdictionId?: string;
    ruleType?: string;
    enabled?: boolean;
  }) {
    return this.http.get<{ data: any[]; count: number }>("/api/v1/aml/rules", {
      params,
    });
  }

  async createRule(data: any) {
    return this.http.post<any>("/api/v1/aml/rules", data);
  }

  async updateRule(ruleId: string, data: any) {
    return this.http.patch<any>(`/api/v1/aml/rules/${ruleId}`, data);
  }

  // AML Screening
  async listScreening(params?: { subjectId?: string; status?: string }) {
    return this.http.get<{ data: any[]; count: number }>(
      "/api/v1/aml/screening",
      { params },
    );
  }

  async createScreening(data: any) {
    return this.http.post<any>("/api/v1/aml/screening", data);
  }

  async getScreening(screeningId: string) {
    return this.http.get<any>(`/api/v1/aml/screening/${screeningId}`);
  }

  // AML Alerts
  async listAlerts(params?: {
    status?: string;
    severity?: string;
    subjectId?: string;
    assignedTo?: string;
  }) {
    return this.http.get<{ data: any[]; count: number }>("/api/v1/aml/alerts", {
      params,
    });
  }

  async createAlert(data: any) {
    return this.http.post<any>("/api/v1/aml/alerts", data);
  }

  async getAlert(alertId: string) {
    return this.http.get<any>(`/api/v1/aml/alerts/${alertId}`);
  }

  async updateAlert(alertId: string, data: any) {
    return this.http.patch<any>(`/api/v1/aml/alerts/${alertId}`, data);
  }

  // AML Cases
  async listCases(params?: {
    status?: string;
    priority?: string;
    assignedTo?: string;
    subjectId?: string;
  }) {
    return this.http.get<{ data: any[]; count: number }>("/api/v1/aml/cases", {
      params,
    });
  }

  async createCase(data: any) {
    return this.http.post<any>("/api/v1/aml/cases", data);
  }

  async getCase(caseId: string) {
    return this.http.get<any>(`/api/v1/aml/cases/${caseId}`);
  }

  async updateCase(caseId: string, data: any) {
    return this.http.patch<any>(`/api/v1/aml/cases/${caseId}`, data);
  }
}

class PrivacyConsentApi {
  constructor(private http: HttpClient) {}

  // Consent Management
  async listConsents(params?: {
    subjectId?: string;
    purpose?: string;
    status?: string;
  }) {
    return this.http.get<{ data: any[]; count: number }>("/api/v1/consent", {
      params,
    });
  }

  async createConsent(data: any) {
    return this.http.post<any>("/api/v1/consent", data);
  }

  async getConsent(consentId: string) {
    return this.http.get<any>(`/api/v1/consent/${consentId}`);
  }

  async updateConsent(consentId: string, data: any) {
    return this.http.patch<any>(`/api/v1/consent/${consentId}`, data);
  }

  async deleteConsent(consentId: string) {
    return this.http.delete<any>(`/api/v1/consent/${consentId}`);
  }

  // Data Access Logs
  async listDataAccessLogs(params?: {
    subjectId?: string;
    accessedBy?: string;
    accessType?: string;
    fromDate?: string;
    toDate?: string;
  }) {
    return this.http.get<{ data: any[]; count: number }>(
      "/api/v1/consent/access-logs",
      { params },
    );
  }

  async createDataAccessLog(data: any) {
    return this.http.post<any>("/api/v1/consent/access-logs", data);
  }

  // DSAR Requests (Data Subject Access Requests)
  async listDsarRequests(params?: {
    subjectId?: string;
    requestType?: string;
    status?: string;
  }) {
    return this.http.get<{ data: any[]; count: number }>(
      "/api/v1/consent/dsar",
      { params },
    );
  }

  async createDsarRequest(data: any) {
    return this.http.post<any>("/api/v1/consent/dsar", data);
  }

  async getDsarRequest(dsarId: string) {
    return this.http.get<any>(`/api/v1/consent/dsar/${dsarId}`);
  }

  async updateDsarRequest(dsarId: string, data: any) {
    return this.http.patch<any>(`/api/v1/consent/dsar/${dsarId}`, data);
  }
}

class DeveloperApi {
  constructor(private http: HttpClient) {}

  // Developer Clients
  async listClients(params?: { status?: string; createdBy?: string }) {
    return this.http.get<{ data: any[]; count: number }>(
      "/api/v1/developer/clients",
      { params },
    );
  }

  async createClient(data: any) {
    return this.http.post<any>("/api/v1/developer/clients", data);
  }

  async getClient(clientId: string) {
    return this.http.get<any>(`/api/v1/developer/clients/${clientId}`);
  }

  async updateClient(clientId: string, data: any) {
    return this.http.patch<any>(`/api/v1/developer/clients/${clientId}`, data);
  }

  async deleteClient(clientId: string) {
    return this.http.delete<any>(`/api/v1/developer/clients/${clientId}`);
  }

  // API Keys
  async listApiKeys(params?: {
    clientId?: string;
    environment?: string;
    status?: string;
  }) {
    return this.http.get<{ data: any[]; count: number }>(
      "/api/v1/developer/api-keys",
      { params },
    );
  }

  async createApiKey(data: any) {
    return this.http.post<any>("/api/v1/developer/api-keys", data);
  }

  async getApiKey(apiKeyId: string) {
    return this.http.get<any>(`/api/v1/developer/api-keys/${apiKeyId}`);
  }

  async updateApiKey(apiKeyId: string, data: any) {
    return this.http.patch<any>(`/api/v1/developer/api-keys/${apiKeyId}`, data);
  }

  async deleteApiKey(apiKeyId: string) {
    return this.http.delete<any>(`/api/v1/developer/api-keys/${apiKeyId}`);
  }

  async rotateApiKey(apiKeyId: string) {
    return this.http.post<any>(`/api/v1/developer/api-keys/${apiKeyId}/rotate`);
  }
}

class PartnersApi {
  constructor(private http: HttpClient) {}

  // Partners
  async listPartners(params?: {
    status?: string;
    tier?: string;
    country?: string;
  }) {
    return this.http.get<{ data: any[]; count: number }>("/api/v1/partners", {
      params,
    });
  }

  async createPartner(data: any) {
    return this.http.post<any>("/api/v1/partners", data);
  }

  async getPartner(partnerId: string) {
    return this.http.get<any>(`/api/v1/partners/${partnerId}`);
  }

  async updatePartner(partnerId: string, data: any) {
    return this.http.patch<any>(`/api/v1/partners/${partnerId}`, data);
  }

  // Partner Programs
  async listPrograms(params?: {
    partnerId?: string;
    programType?: string;
    status?: string;
  }) {
    return this.http.get<{ data: any[]; count: number }>(
      "/api/v1/partners/programs",
      { params },
    );
  }

  async createProgram(data: any) {
    return this.http.post<any>("/api/v1/partners/programs", data);
  }

  async getProgram(programId: string) {
    return this.http.get<any>(`/api/v1/partners/programs/${programId}`);
  }

  async updateProgram(programId: string, data: any) {
    return this.http.patch<any>(`/api/v1/partners/programs/${programId}`, data);
  }

  // Revenue Shares
  async listRevenueShares(params?: {
    partnerId?: string;
    programId?: string;
    status?: string;
  }) {
    return this.http.get<{ data: any[]; count: number }>(
      "/api/v1/partners/revenue-shares",
      { params },
    );
  }

  async createRevenueShare(data: any) {
    return this.http.post<any>("/api/v1/partners/revenue-shares", data);
  }

  async getRevenueShare(revenueShareId: string) {
    return this.http.get<any>(
      `/api/v1/partners/revenue-shares/${revenueShareId}`,
    );
  }

  async updateRevenueShare(revenueShareId: string, data: any) {
    return this.http.patch<any>(
      `/api/v1/partners/revenue-shares/${revenueShareId}`,
      data,
    );
  }
}

class DisputesApi {
  constructor(private http: HttpClient) {}

  // Disputes
  async listDisputes(params?: {
    status?: string;
    priority?: string;
    relatedEntityType?: string;
    assignedTo?: string;
  }) {
    return this.http.get<{ data: any[]; count: number }>("/api/v1/disputes", {
      params,
    });
  }

  async createDispute(data: any) {
    return this.http.post<any>("/api/v1/disputes", data);
  }

  async getDispute(disputeId: string) {
    return this.http.get<any>(`/api/v1/disputes/${disputeId}`);
  }

  async updateDispute(disputeId: string, data: any) {
    return this.http.patch<any>(`/api/v1/disputes/${disputeId}`, data);
  }

  // Dispute Actions
  async addDisputeAction(disputeId: string, data: any) {
    return this.http.post<any>(`/api/v1/disputes/${disputeId}/actions`, data);
  }

  // Collection Cases
  async listCollectionCases(params?: {
    status?: string;
    contractId?: string;
    debtorId?: string;
    assignedTo?: string;
  }) {
    return this.http.get<{ data: any[]; count: number }>(
      "/api/v1/disputes/collections",
      { params },
    );
  }

  async createCollectionCase(data: any) {
    return this.http.post<any>("/api/v1/disputes/collections", data);
  }

  async getCollectionCase(caseId: string) {
    return this.http.get<any>(`/api/v1/disputes/collections/${caseId}`);
  }

  async updateCollectionCase(caseId: string, data: any) {
    return this.http.patch<any>(`/api/v1/disputes/collections/${caseId}`, data);
  }
}

class ObservabilityApi {
  constructor(private http: HttpClient) {}

  // SLO Configuration
  async listSloConfigs(params?: { rail?: string }) {
    return this.http.get<{ data: any[]; count: number }>(
      "/api/v1/observability/slo",
      { params },
    );
  }

  async createSloConfig(data: any) {
    return this.http.post<any>("/api/v1/observability/slo", data);
  }

  async getSloConfig(sloId: string) {
    return this.http.get<any>(`/api/v1/observability/slo/${sloId}`);
  }

  async updateSloConfig(sloId: string, data: any) {
    return this.http.patch<any>(`/api/v1/observability/slo/${sloId}`, data);
  }

  async deleteSloConfig(sloId: string) {
    return this.http.delete<any>(`/api/v1/observability/slo/${sloId}`);
  }

  // Audit Logs
  async queryAuditLogs(params?: {
    rail?: string;
    entityType?: string;
    entityId?: string;
    action?: string;
    performedByType?: string;
    performedById?: string;
    fromDate?: string;
    toDate?: string;
    limit?: number;
    offset?: number;
  }) {
    return this.http.get<{ data: any[]; pagination: any }>(
      "/api/v1/observability/audit",
      { params },
    );
  }

  async getAuditLog(auditId: string) {
    return this.http.get<any>(`/api/v1/observability/audit/${auditId}`);
  }

  // Shariah Compliance Monitoring
  async queryShariahEvents(params?: {
    rail?: string;
    entityType?: string;
    entityId?: string;
    complianceStatus?: string;
    breachSeverity?: string;
    fromDate?: string;
    toDate?: string;
    limit?: number;
    offset?: number;
  }) {
    return this.http.get<{ data: any[]; pagination: any }>(
      "/api/v1/observability/shariah",
      { params },
    );
  }

  async getShariahEvent(eventId: string) {
    return this.http.get<any>(`/api/v1/observability/shariah/${eventId}`);
  }

  // Export Jobs
  async listExportJobs(params?: { status?: string }) {
    return this.http.get<{ data: any[]; count: number }>(
      "/api/v1/observability/exports",
      { params },
    );
  }

  async createExportJob(data: any) {
    return this.http.post<any>("/api/v1/observability/exports", data);
  }

  async getExportJob(exportId: string) {
    return this.http.get<any>(`/api/v1/observability/exports/${exportId}`);
  }
}

// ============================================================================
// Settlement Engine API — atomic DvP/FOP/RVP/DFP confirmation, AAOIFI SS-1/8/10/17/21/30,
// CSDR Art. 7 cash-penalty regime, ribawi-pair-aware netting. 24x7x365 settlement window.
// Reclaims 60-140 bps per corridor by collapsing the T+0..T+2 settlement gap.
// ============================================================================

class SettlementApi {
  constructor(private http: HttpClient) {}

  // Atomic settlement confirmation across DvP / FOP / RVP / DFP modes.
  async confirm(data: SettlementConfirmRequest) {
    return this.http.post<SettlementResult>(
      "/api/v1/settlement/confirm",
      data,
    );
  }

  // Get settlement status with state machine state + AAOIFI references.
  async getStatus(settlementId: string) {
    return this.http.get<SettlementStatus>(
      `/api/v1/settlement/${settlementId}/status`,
    );
  }

  // Cancel a settlement before finality. Post-finality cancellations require unwind.
  async cancel(settlementId: string, reason: string) {
    return this.http.post<SettlementResult>(
      `/api/v1/settlement/${settlementId}/cancel`,
      { reason },
    );
  }

  // List settlements with optional filters (status, contract, date window).
  async list(params?: {
    status?: SettlementStatusValue;
    contractId?: string;
    from?: string;
    to?: string;
    limit?: number;
  }) {
    return this.http.get<PaginatedResponse<Settlement>>(
      "/api/v1/settlement",
      { params },
    );
  }

  // Get a single settlement record by ID.
  async get(settlementId: string) {
    return this.http.get<Settlement>(`/api/v1/settlement/${settlementId}`);
  }

  // Ribawi-aware netting calculation across a corridor / currency pair / window.
  // Honours AAOIFI SS-1 (Trading in Currencies) and SS-30 (Monetisation) constraints.
  async netting(data: SettlementNettingRequest) {
    return this.http.post<SettlementNettingResult>(
      "/api/v1/settlement/netting",
      data,
    );
  }

  // Mark a settlement as final (CSDR Art. 7 finality timestamp).
  async finalize(settlementId: string) {
    return this.http.post<SettlementResult>(
      `/api/v1/settlement/${settlementId}/finalize`,
    );
  }
}

// ============================================================================
// Evidence Engine API — signed compliance pack covering 47/54 controls across
// SOC 2 / ISO 27001 / AAOIFI / GDPR / PSD2 / IFSB / ISO 20022. SHA-256 Merkle root +
// HMAC signature. One-call verification (no auditor portal required).
// Reclaims 30-55 bps on audit + re-papering cycles.
// ============================================================================

class EvidenceApi {
  constructor(private http: HttpClient) {}

  // Export a signed evidence pack for a trade or contract in JSON / CSV / PDF / ZIP.
  async export(data: EvidenceExportRequest) {
    return this.http.post<EvidencePack>("/api/v1/evidence/export", data);
  }

  // One-call verification of an evidence pack against its Merkle root + HMAC signature.
  async verify(data: EvidenceVerifyRequest) {
    return this.http.post<EvidenceVerifyResult>(
      "/api/v1/evidence/verify",
      data,
    );
  }

  // List available compliance frameworks and the control IDs each covers
  // (SOC 2, ISO 27001, AAOIFI, GDPR, PSD2, IFSB, ISO 20022).
  async getControls(params?: { framework?: ComplianceFramework }) {
    return this.http.get<EvidenceControlCatalogue>(
      "/api/v1/evidence/controls",
      { params },
    );
  }

  // List evidence packs with optional filters (trade, contract, date window).
  async list(params?: {
    tradeId?: string;
    contractId?: string;
    from?: string;
    to?: string;
    limit?: number;
  }) {
    return this.http.get<PaginatedResponse<EvidencePack>>(
      "/api/v1/evidence",
      { params },
    );
  }

  // Get a single evidence pack by ID.
  async get(packId: string) {
    return this.http.get<EvidencePack>(`/api/v1/evidence/${packId}`);
  }

  // Download the raw artifact for an evidence pack (signed bundle).
  async download(packId: string) {
    return this.http.get<Blob>(`/api/v1/evidence/${packId}/download`);
  }
}

// ============================================================================
// Type Placeholders (would be generated from OpenAPI)
// ============================================================================

export interface Contract {
  id: string;
  [key: string]: unknown;
}
export interface CreateContractRequest {
  [key: string]: unknown;
}
export interface UpdateContractRequest {
  [key: string]: unknown;
}
export interface ValidationResult {
  valid: boolean;
  errors?: string[];
}
export interface Jurisdiction {
  id: string;
  name: string;
  [key: string]: unknown;
}
export interface Consent {
  id: string;
  [key: string]: unknown;
}
export interface CreateConsentRequest {
  [key: string]: unknown;
}
export interface Customer {
  id: string;
  [key: string]: unknown;
}
export interface CreateCustomerRequest {
  [key: string]: unknown;
}
export interface ScreeningResult {
  [key: string]: unknown;
}
export interface Case {
  id: string;
  [key: string]: unknown;
}
export interface CreateCaseRequest {
  [key: string]: unknown;
}
export interface UpdateCaseRequest {
  [key: string]: unknown;
}
export interface ZakatCalculation {
  id: string;
  [key: string]: unknown;
}
export interface ZakatCalculationRequest {
  [key: string]: unknown;
}
export interface ReconciliationJob {
  id: string;
  [key: string]: unknown;
}
export interface CreateReconciliationJobRequest {
  [key: string]: unknown;
}
export interface RoutingRule {
  id: string;
  [key: string]: unknown;
}
export interface CreateRoutingRuleRequest {
  [key: string]: unknown;
}
export interface RouteRequest {
  [key: string]: unknown;
}
export interface RouteResult {
  [key: string]: unknown;
}
export interface Message {
  id: string;
  [key: string]: unknown;
}
export interface SendMessageRequest {
  [key: string]: unknown;
}
export interface Obligation {
  id: string;
  [key: string]: unknown;
}
export interface CreateObligationRequest {
  [key: string]: unknown;
}
export interface ClearingCycle {
  id: string;
  [key: string]: unknown;
}
export interface CreateCycleRequest {
  [key: string]: unknown;
}
export interface TreasuryAccount {
  id: string;
  [key: string]: unknown;
}
export interface CreateTreasuryAccountRequest {
  [key: string]: unknown;
}
export interface LiquidityLadder {
  [key: string]: unknown;
}
export interface GapAnalysis {
  [key: string]: unknown;
}
export interface Exposure {
  id: string;
  [key: string]: unknown;
}
export interface CreateExposureRequest {
  [key: string]: unknown;
}
export interface RiskLimit {
  id: string;
  [key: string]: unknown;
}
export interface StressTestRequest {
  [key: string]: unknown;
}
export interface StressTestResult {
  [key: string]: unknown;
}
export interface ConcentrationAnalysis {
  [key: string]: unknown;
}
export interface Mandate {
  id: string;
  [key: string]: unknown;
}
export interface CreateMandateRequest {
  [key: string]: unknown;
}
export interface Position {
  id: string;
  [key: string]: unknown;
}
export interface PerformanceMetrics {
  [key: string]: unknown;
}
export interface LegalTemplate {
  id: string;
  [key: string]: unknown;
}
export interface CreateLegalTemplateRequest {
  [key: string]: unknown;
}
export interface GenerateDocumentRequest {
  [key: string]: unknown;
}
export interface GeneratedDocument {
  [key: string]: unknown;
}
export interface UnderwritingProposal {
  id: string;
  [key: string]: unknown;
}
export interface CreateUnderwritingProposalRequest {
  [key: string]: unknown;
}
export interface UnderwritingDecision {
  [key: string]: unknown;
}
export interface CompliancePolicy {
  id: string;
  [key: string]: unknown;
}
export interface CreateCompliancePolicyRequest {
  [key: string]: unknown;
}
export interface ComplianceCheck {
  id: string;
  [key: string]: unknown;
}
export interface ComplianceCheckRequest {
  [key: string]: unknown;
}
export interface Committee {
  id: string;
  [key: string]: unknown;
}
export interface CreateCommitteeRequest {
  [key: string]: unknown;
}
export interface GovernanceDecision {
  id: string;
  [key: string]: unknown;
}
export interface CreateDecisionRequest {
  [key: string]: unknown;
}
export interface EventSubscription {
  id: string;
  [key: string]: unknown;
}
export interface CreateEventSubscriptionRequest {
  [key: string]: unknown;
}
export interface Event {
  id: string;
  [key: string]: unknown;
}
export interface PublishEventRequest {
  [key: string]: unknown;
}
export interface Notification {
  id: string;
  [key: string]: unknown;
}
export interface SendNotificationRequest {
  [key: string]: unknown;
}
export interface NotificationTemplate {
  id: string;
  [key: string]: unknown;
}
export interface CreateNotificationTemplateRequest {
  [key: string]: unknown;
}
export interface ReportDefinition {
  id: string;
  name: string;
  type: string;
  [key: string]: unknown;
}
export interface CreateReportDefinitionRequest {
  [key: string]: unknown;
}
export interface Report {
  id: string;
  status: string;
  [key: string]: unknown;
}
export interface GenerateReportRequest {
  [key: string]: unknown;
}
export interface Dashboard {
  id: string;
  name: string;
  [key: string]: unknown;
}
export interface AnalyticsMetrics {
  [key: string]: unknown;
}
export interface AnalyticsTrends {
  [key: string]: unknown;
}

// Search Types
export interface SearchHit<T> {
  id: string;
  document: T;
  score: number;
  highlights?: Record<string, string[]>;
}

export interface SearchResponse<T> {
  hits: SearchHit<T>[];
  query: string;
  processingTimeMs: number;
  limit: number;
  offset: number;
  estimatedTotalHits: number;
  facetDistribution?: Record<string, Record<string, number>>;
}

export interface MultiSearchResponse {
  results: Array<{
    indexUid: string;
    hits: SearchHit<Record<string, unknown>>[];
    query: string;
    processingTimeMs: number;
    limit: number;
    offset: number;
    estimatedTotalHits: number;
  }>;
}

export interface SearchContractsParams {
  q: string;
  type?: string;
  status?: string;
  jurisdiction?: string;
  limit?: number;
  offset?: number;
  [key: string]: string | number | boolean | undefined;
}

export interface SearchPartiesParams {
  q: string;
  type?: string;
  kycStatus?: string;
  country?: string;
  limit?: number;
  offset?: number;
  [key: string]: string | number | boolean | undefined;
}

export interface SearchCasesParams {
  q: string;
  type?: string;
  status?: string;
  priority?: string;
  limit?: number;
  offset?: number;
  [key: string]: string | number | boolean | undefined;
}

export interface SearchSkusParams {
  q: string;
  type?: string;
  status?: string;
  limit?: number;
  offset?: number;
  [key: string]: string | number | boolean | undefined;
}

export interface SearchEndpointsParams {
  q: string;
  method?: string;
  tag?: string;
  limit?: number;
  offset?: number;
  [key: string]: string | number | boolean | undefined;
}

export interface GlobalSearchParams {
  q: string;
  indexes?: string[];
  limit?: number;
  [key: string]: string | number | boolean | string[] | undefined;
}

export interface ContractSearchResult {
  id: string;
  contractNumber: string;
  type: string;
  status: string;
  [key: string]: unknown;
}

export interface PartySearchResult {
  id: string;
  name: string;
  type: string;
  kycStatus: string;
  [key: string]: unknown;
}

export interface CaseSearchResult {
  id: string;
  caseNumber: string;
  subject: string;
  status: string;
  [key: string]: unknown;
}

export interface SkuSearchResult {
  id: string;
  skuCode: string;
  name: string;
  type: string;
  [key: string]: unknown;
}

export interface EndpointSearchResult {
  id: string;
  path: string;
  method: string;
  summary: string;
  [key: string]: unknown;
}

export interface SearchStatsResponse {
  indexes: Array<{
    name: string;
    numberOfDocuments: number;
    isIndexing: boolean;
  }>;
}

export interface SearchHealthResponse {
  status: "healthy" | "unhealthy";
  version?: string;
  error?: string;
}

export type SearchIndexName =
  | "contracts"
  | "parties"
  | "cases"
  | "skus"
  | "endpoints";

export interface ReindexResponse {
  taskUid: number;
  indexUid: string;
  status: string;
}

// ============================================================================
// Settlement Engine Types
// ============================================================================

// Settlement modes — Delivery vs Payment, Free Of Payment, Receive vs Payment,
// Delivery Free of Payment. Maps to AAOIFI SS-1/8/10/17/21/30 contract structures.
export type SettlementMode = "DvP" | "FOP" | "RVP" | "DFP";

export type SettlementStatusValue =
  | "pending"
  | "matched"
  | "confirmed"
  | "settled"
  | "final"
  | "cancelled"
  | "failed"
  | "unwound";

export interface SettlementParty {
  partyId: string;
  role: "deliverer" | "receiver" | "payer" | "payee";
  account?: string;
  bic?: string;
  lei?: string;
}

export interface SettlementConfirmRequest {
  contractId: string;
  mode: SettlementMode;
  parties: SettlementParty[];
  amount?: string;
  currency?: string;
  valueDate?: string;
  reference?: string;
  metadata?: Record<string, unknown>;
}

export interface SettlementResult {
  settlementId: string;
  contractId: string;
  mode: SettlementMode;
  status: SettlementStatusValue;
  finalityAt?: string;
  aaoifiReferences?: string[];
  csdrPenaltyBps?: number;
  [key: string]: unknown;
}

export interface SettlementStatus {
  settlementId: string;
  status: SettlementStatusValue;
  state: string; // state-machine state
  aaoifiReferences?: string[];
  csdrCompliant?: boolean;
  lastTransitionAt?: string;
  history?: Array<{
    at: string;
    from: string;
    to: string;
    reason?: string;
  }>;
}

export interface Settlement {
  id: string;
  contractId: string;
  mode: SettlementMode;
  status: SettlementStatusValue;
  amount?: string;
  currency?: string;
  valueDate?: string;
  finalityAt?: string;
  [key: string]: unknown;
}

export interface SettlementNettingRequest {
  corridor: string; // e.g. "AE-SA", "MY-ID"
  pair: string; // e.g. "AED/SAR" — ribawi-pair check applied
  window: { from: string; to: string };
  partyIds?: string[];
}

export interface SettlementNettingResult {
  corridor: string;
  pair: string;
  window: { from: string; to: string };
  ribawiCompliant: boolean;
  grossNotional: string;
  netNotional: string;
  reductionBps: number;
  legs: Array<{
    settlementId: string;
    direction: "in" | "out";
    amount: string;
    currency: string;
  }>;
  [key: string]: unknown;
}

// ============================================================================
// Evidence Engine Types
// ============================================================================

export type ComplianceFramework =
  | "SOC2"
  | "ISO27001"
  | "AAOIFI"
  | "GDPR"
  | "PSD2"
  | "IFSB"
  | "ISO20022";

export type EvidenceFormat = "json" | "csv" | "pdf" | "zip";

export interface EvidenceExportRequest {
  tradeId?: string;
  contractId?: string;
  format: EvidenceFormat;
  frameworks?: ComplianceFramework[];
  includeMerkleProof?: boolean;
}

export interface EvidencePack {
  packId: string;
  tradeId?: string;
  contractId?: string;
  format: EvidenceFormat;
  frameworks: ComplianceFramework[];
  controlsCovered: number;
  controlsTotal: number;
  merkleRoot: string;
  signature: string; // HMAC over (merkleRoot || packId || issuedAt)
  signatureAlg: "HMAC-SHA256";
  issuedAt: string;
  downloadUrl?: string;
  [key: string]: unknown;
}

export interface EvidenceVerifyRequest {
  packId: string;
  merkleRoot: string;
  signature: string;
}

export interface EvidenceVerifyResult {
  packId: string;
  valid: boolean;
  merkleRootValid: boolean;
  signatureValid: boolean;
  controlsVerified: number;
  controlsTotal: number;
  frameworks: ComplianceFramework[];
  verifiedAt: string;
  errors?: string[];
}

export interface EvidenceControl {
  id: string; // e.g. "SOC2-CC6.1", "AAOIFI-SS-17-3.1"
  framework: ComplianceFramework;
  description: string;
  covered: boolean;
}

export interface EvidenceControlCatalogue {
  frameworks: ComplianceFramework[];
  controlsCovered: number;
  controlsTotal: number;
  controls: EvidenceControl[];
}
