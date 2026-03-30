# IOF SDKs

Official client libraries for the Islamic Open Finance™ (IOF) Platform in multiple programming languages.

[![License](https://img.shields.io/badge/License-Apache%202.0-blue?logo=apache&logoColor=white)](LICENSE)

## Available SDKs

| Language       | Package                 | Version                                                          | Status         | Documentation                  |
| -------------- | ----------------------- | ---------------------------------------------------------------- | -------------- | ------------------------------ |
| **TypeScript** | `@iof/sdk`              | ![npm](https://img.shields.io/npm/v/@iof/sdk)                    | ✅ Stable      | [README](typescript/README.md) |
| **Python**     | `iof-sdk`               | ![PyPI](https://img.shields.io/pypi/v/iof-sdk)                   | ✅ Stable      | [README](python/README.md)     |
| **Java**       | `com.iof:iof-sdk`       | ![Maven](https://img.shields.io/maven-central/v/com.iof/iof-sdk) | 🚧 In Progress | [README](java/README.md)       |
| **Go**         | `github.com/iof/go-sdk` | ![Go](https://img.shields.io/github/v/release/iof/go-sdk)        | 🚧 In Progress | [README](go/README.md)         |

## Quick Start

### TypeScript/JavaScript

```bash
npm install @iof/sdk
```

```typescript
import { IOFClient } from "@iof/sdk";

const client = new IOFClient({
  apiKey: process.env.IOF_API_KEY,
  environment: "production",
});

// Create Murabaha contract
const contract = await client.contracts.createMurabaha({
  customer_id: "CUST-123",
  asset_description: "Toyota Camry 2024",
  asset_category: "VEHICLE",
  cost_price: 50000,
  profit_amount: 5000,
  installment_count: 24,
  currency: "SAR",
});

console.log("Contract created:", contract.id);
```

### Python

```bash
pip install iof-sdk
```

```python
from iof_sdk import IOFClient

client = IOFClient(
    api_key=os.environ['IOF_API_KEY'],
    environment='production'
)

# Create Murabaha contract
contract = client.contracts.create_murabaha(
    customer_id='CUST-123',
    asset_description='Toyota Camry 2024',
    asset_category='VEHICLE',
    cost_price=50000,
    profit_amount=5000,
    installment_count=24,
    currency='SAR'
)

print(f'Contract created: {contract["id"]}')
```

### Java (Coming Soon)

```xml
<dependency>
    <groupId>com.iof</groupId>
    <artifactId>iof-sdk</artifactId>
    <version>1.0.0</version>
</dependency>
```

```java
import com.iof.IOFClient;
import com.iof.models.CreateMurabahaRequest;

IOFClient client = new IOFClient.Builder()
    .apiKey(System.getenv("IOF_API_KEY"))
    .environment(Environment.PRODUCTION)
    .build();

CreateMurabahaRequest request = CreateMurabahaRequest.builder()
    .customerId("CUST-123")
    .assetDescription("Toyota Camry 2024")
    .assetCategory(AssetCategory.VEHICLE)
    .costPrice(50000.0)
    .profitAmount(5000.0)
    .installmentCount(24)
    .currency("SAR")
    .build();

MurabahaContract contract = client.contracts().createMurabaha(request);
System.out.println("Contract created: " + contract.getId());
```

### Go (Coming Soon)

```bash
go get github.com/iof/go-sdk
```

```go
package main

import (
    "fmt"
    "github.com/iof/go-sdk"
)

func main() {
    client := iof.NewClient(os.Getenv("IOF_API_KEY"), iof.Production)

    contract, err := client.Contracts.CreateMurabaha(&iof.CreateMurabahaRequest{
        CustomerID:        "CUST-123",
        AssetDescription:  "Toyota Camry 2024",
        AssetCategory:     iof.AssetCategoryVehicle,
        CostPrice:         50000.0,
        ProfitAmount:      5000.0,
        InstallmentCount:  24,
        Currency:          "SAR",
    })

    if err != nil {
        panic(err)
    }

    fmt.Printf("Contract created: %s\n", contract.ID)
}
```

## Features

All SDKs provide:

✅ **Complete API Coverage** - All 142 Rails, 1,700+ endpoints
✅ **Type Safety** - Full TypeScript types, Python type hints, Java generics
✅ **Async Support** - Async/await in TypeScript/Python, CompletableFuture in Java
✅ **Error Handling** - Comprehensive error types with retry logic
✅ **Authentication** - OAuth 2.0 and API key support
✅ **Webhooks** - Signature verification and payload parsing
✅ **Pagination** - Automatic pagination handling
✅ **Rate Limiting** - Built-in rate limit handling with backoff
✅ **Testing** - Mock server integration for testing
✅ **Documentation** - Inline docs and comprehensive guides

## Supported Rails

All SDKs support the complete IOF Platform API:

### Core Rails

- **Contracts** - 28 Islamic contract types (Murabaha, Ijarah, Musharaka, etc.)
- **Cards** - Shariah-compliant card operations (ISO 8583)
- **Clearing** - Multi-rail settlement and reconciliation
- **Treasury** - FX, hedging, liquidity management
- **Shariah** - Compliance rules and monitoring

### Governance Rails

- **KYC/KYB** - Customer and business verification
- **AML/CFT** - Anti-money laundering and screening
- **Consent** - Privacy consent management (GDPR, CCPA)
- **Disputes** - Dispute and chargeback handling
- **Collections** - Collections and recovery
- **Zakat** - Zakat calculation and distribution
- **Impact** - Social impact and ESG tracking

### Platform Rails

- **IAM** - Identity and access management
- **Metadata** - Entity registry, lineage, classification
- **Taxonomy** - Controlled vocabularies
- **Webhooks** - Event subscriptions
- **Developer** - API keys, analytics

## Authentication

### API Key (Recommended for Server-Side)

```typescript
const client = new IOFClient({
  apiKey: process.env.IOF_API_KEY,
});
```

### OAuth 2.0 (For User-Facing Apps)

```typescript
const client = new IOFClient({
  accessToken: "eyJhbGciOiJSUzI1NiIs...",
});

// Auto-refresh tokens
client.onTokenRefresh((newTokens) => {
  // Save new tokens
  saveTokens(newTokens);
});
```

## Error Handling

All SDKs provide consistent error types:

```typescript
try {
  const contract = await client.contracts.createMurabaha(data);
} catch (error) {
  if (error instanceof ShariahBreachError) {
    console.error("Shariah violation:", error.breaches);
  } else if (error instanceof ValidationError) {
    console.error("Validation failed:", error.details);
  } else if (error instanceof RateLimitError) {
    console.error("Rate limit exceeded, retry after:", error.retryAfter);
  } else {
    console.error("API error:", error.message);
  }
}
```

## Webhook Verification

Verify webhook signatures:

```typescript
import { verifyWebhookSignature } from "@iof/sdk";

app.post("/webhooks", (req, res) => {
  const signature = req.headers["x-iof-signature"];
  const timestamp = req.headers["x-iof-timestamp"];
  const payload = req.body;

  if (!verifyWebhookSignature(payload, signature, timestamp, webhookSecret)) {
    return res.status(401).send("Invalid signature");
  }

  // Process webhook
  console.log("Event:", payload.event_type);
  res.send("OK");
});
```

## Pagination

Automatic pagination support:

```typescript
// Manual pagination
const page1 = await client.contracts.listMurabaha({ page: 1, limit: 20 });

// Auto-iterate through all pages
for await (const contract of client.contracts.listMurabahaIterator()) {
  console.log(contract.id);
}
```

## Retry Logic

Built-in retry with exponential backoff:

```typescript
const client = new IOFClient({
  apiKey: process.env.IOF_API_KEY,
  maxRetries: 3,
  retryDelay: 1000, // 1 second base delay
});
```

## Timeouts

Configure request timeouts:

```typescript
const client = new IOFClient({
  apiKey: process.env.IOF_API_KEY,
  timeout: 30000, // 30 seconds
});
```

## Environment Variables

Configure via environment variables:

```bash
export IOF_API_KEY=<your-api-key>
export IOF_ENVIRONMENT=production
export IOF_TIMEOUT=30000
export IOF_MAX_RETRIES=3
```

```typescript
const client = new IOFClient(); // Auto-loads from env vars
```

## Testing

All SDKs work with the IOF Mock Server:

```bash
# Start mock server
docker run -p 8080:8080 iof/mock-server

# Point SDK to mock server
const client = new IOFClient({
  apiKey: 'test_key',
  baseUrl: 'http://localhost:8080'
});
```

## Development

### Prerequisites

- **TypeScript**: Node.js 18+, npm 9+
- **Python**: Python 3.8+, pip
- **Java**: JDK 11+, Maven/Gradle
- **Go**: Go 1.19+

### Build from Source

```bash
# Clone repository
git clone https://github.com/Islamic-Open-Finance/iof-sdks.git
cd iof-sdks

# TypeScript
cd typescript
npm install
npm run build
npm test

# Python
cd python
pip install -e .
pytest

# Java
cd java
mvn clean install

# Go
cd go
go build
go test ./...
```

## Versioning

All SDKs follow [Semantic Versioning 2.0.0](https://semver.org/):

- **MAJOR**: Incompatible API changes
- **MINOR**: Backwards-compatible functionality
- **PATCH**: Backwards-compatible bug fixes

Version compatibility:

| SDK Version | API Version | Min API Version |
| ----------- | ----------- | --------------- |
| 1.x.x       | 1.x.x       | 1.0.0           |
| 2.x.x       | 2.x.x       | 2.0.0           |

## Migration Guides

- [Migrating from v0 to v1](docs/migrations/v0-to-v1.md)
- [Migrating from REST to SDK](docs/migrations/rest-to-sdk.md)

## Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Reporting Issues

- **Security vulnerabilities**: security@islamicopenfinance.com
- **Bug reports**: [GitHub Issues](https://github.com/Islamic-Open-Finance/iof-sdks/issues)
- **Feature requests**: [GitHub Discussions](https://github.com/Islamic-Open-Finance/iof-sdks/discussions)

## Support

- **Documentation**: https://docs.islamicopenfinance.com
- **Developer Portal**: https://developers.islamicopenfinance.com
- **Community Forum**: https://community.islamicopenfinance.com
- **Email**: support@islamicopenfinance.com

## License

All SDKs are licensed under the Apache License 2.0 - see [LICENSE](LICENSE) file for details.

## Related Projects

- [IOF OpenAPI](https://github.com/Islamic-Open-Finance/iof-openapi) - OpenAPI specification
- [IOF DevTools](https://github.com/Islamic-Open-Finance/iof-devtools) - CLI tools
- [IOF Platform](https://github.com/Islamic-Open-Finance/app) - Main platform

---

**Built with ❤️ for the Islamic finance community**
