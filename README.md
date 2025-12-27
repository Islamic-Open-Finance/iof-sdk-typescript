# IOF TypeScript SDK

Official TypeScript/JavaScript SDK for Islamic Open Finance APIs.

[![npm version](https://badge.fury.io/js/@islamic-open-finance%2Fsdk.svg)](https://www.npmjs.com/package/@islamic-open-finance/sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Installation

```bash
npm install @islamic-open-finance/sdk
# or
yarn add @islamic-open-finance/sdk
# or
pnpm add @islamic-open-finance/sdk
```

## Quick Start

```typescript
import { IOFClient } from '@islamic-open-finance/sdk';

// Initialize the client
const client = new IOFClient({
  apiKey: 'your-api-key',
  environment: 'sandbox', // 'sandbox' | 'production'
});

// Create a Murabaha contract
const contract = await client.contracts.create({
  type: 'murabaha',
  parties: [
    { role: 'seller', entityId: 'entity_123' },
    { role: 'buyer', entityId: 'entity_456' },
  ],
  terms: {
    costPrice: 100000,
    profitMargin: 0.05,
    paymentSchedule: 'monthly',
    tenure: 36,
  },
});

console.log('Contract created:', contract.id);
```

## Features

### All 29 Financial Rails

The SDK provides full coverage for all Islamic Open Finance rails:

| Category | Rails |
|----------|-------|
| **Contracts** | Murabaha, Musharaka, Ijara, Sukuk, Mudaraba, Istisna, Salam |
| **Compliance** | KYC, AML, Consent, Governance, Disputes |
| **Operations** | Treasury, Clearing, Reconciliation, Routing, Settlement |
| **Platform** | Analytics, Billing, Reporting, Notifications, Webhooks |
| **Identity** | Access Consent, Legal, Partners, Underwriting |
| **Specialty** | Zakat, Portfolio, Risk, Cases, Observability |

### Type Safety

Full TypeScript support with comprehensive type definitions:

```typescript
import type { Contract, MurabahaTerms, Party } from '@islamic-open-finance/sdk';

const terms: MurabahaTerms = {
  costPrice: 100000,
  profitMargin: 0.05,
  paymentSchedule: 'monthly',
  tenure: 36,
};
```

### Error Handling

```typescript
import { IOFClient, IOFError } from '@islamic-open-finance/sdk';

try {
  await client.contracts.create({ ... });
} catch (error) {
  if (error instanceof IOFError) {
    console.error('IOF API Error:', error.code, error.message);
    console.error('Request ID:', error.requestId);
  }
}
```

### Pagination

```typescript
// Automatic pagination handling
const contracts = await client.contracts.list({
  status: 'active',
  limit: 100,
});

// Iterate through all pages
for await (const contract of client.contracts.listAll({ status: 'active' })) {
  console.log(contract.id);
}
```

## API Reference

### Contracts

```typescript
// Create a contract
const contract = await client.contracts.create({ ... });

// Get a contract
const contract = await client.contracts.get('contract_123');

// List contracts
const { data, hasMore } = await client.contracts.list({ limit: 50 });

// Update contract status
await client.contracts.updateStatus('contract_123', 'activated');
```

### KYC

```typescript
// Create a verification
const verification = await client.kyc.createVerification({
  entityId: 'entity_123',
  type: 'individual',
  documents: [{ type: 'passport', fileId: 'file_abc' }],
});

// Check verification status
const status = await client.kyc.getVerification(verification.id);
```

### Treasury

```typescript
// Get positions
const positions = await client.treasury.getPositions({
  workspaceId: 'ws_123',
});

// Record a transaction
await client.treasury.recordTransaction({
  type: 'credit',
  amount: 50000,
  currency: 'SAR',
  reference: 'TXN-001',
});
```

### Webhooks

```typescript
// Create a webhook subscription
const webhook = await client.webhooks.create({
  url: 'https://your-server.com/webhooks',
  events: ['contract.created', 'contract.activated'],
  secret: 'whsec_your_secret',
});

// Verify webhook signatures
const isValid = client.webhooks.verifySignature(
  payload,
  signature,
  secret
);
```

### Analytics

```typescript
// Query analytics
const analytics = await client.analytics.query({
  metric: 'contract_volume',
  from: '2024-01-01',
  to: '2024-12-31',
  groupBy: 'month',
});
```

## Configuration Options

```typescript
const client = new IOFClient({
  // Required
  apiKey: 'your-api-key',

  // Optional
  environment: 'sandbox',  // 'sandbox' | 'production'
  baseUrl: 'https://api.custom-domain.com',  // Override base URL
  timeout: 30000,  // Request timeout in ms
  retries: 3,  // Number of retries for failed requests

  // Hooks
  onRequest: (config) => { /* modify request */ },
  onResponse: (response) => { /* handle response */ },
  onError: (error) => { /* handle error */ },
});
```

## Environments

| Environment | Base URL |
|-------------|----------|
| Sandbox | `https://api.sandbox.islamicopen.finance` |
| Production | `https://api.islamicopen.finance` |

## Rate Limits

The SDK automatically handles rate limiting with exponential backoff:

- Sandbox: 1,000 requests/minute
- Production: Based on your SKU tier

## Testing

```typescript
import { IOFClient, createMockClient } from '@islamic-open-finance/sdk/testing';

// Create a mock client for testing
const mockClient = createMockClient();

mockClient.contracts.create.mockResolvedValue({
  id: 'contract_mock_123',
  status: 'draft',
});
```

## Contributing

See [CONTRIBUTING.md](https://github.com/Islamic-Open-Finance/app/blob/main/CONTRIBUTING.md) for guidelines.

## License

Apache License 2.0 - see [LICENSE](./LICENSE) for details.

This license includes an explicit patent grant for enterprise use.

## Links

- [API Documentation](https://docs.islamic-open-finance.com/api)
- [GitHub Repository](https://github.com/Islamic-Open-Finance/iof-sdk-typescript)
- [Issue Tracker](https://github.com/Islamic-Open-Finance/iof-sdk-typescript/issues)
- [Changelog](https://github.com/Islamic-Open-Finance/iof-sdk-typescript/blob/main/CHANGELOG.md)
