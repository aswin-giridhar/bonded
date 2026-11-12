<!-- Generated file — do not edit; regenerated with the SDK. -->

# Policies — operations

Accessor: `client.policies` · Source: `src/resources/policies.ts` · 2 operations · Request and error types: namespace `Policies`

**Type sources**: every type an operation names, with the file that declares it and the schema value exported beside it. Import every name from `bonded-api`; the `Source` path is where to **read** the shape, never what to import. `ApiError`, the runtime error family and the file vocabulary are excluded — see sdk-map.md.

### capturePremium

- **Signature**: `capturePremium(request: Policies.CapturePremiumRequest, options?: RequestOptions): ApiPromise<ApiPolicyCaptureResponse, Policies.CapturePremiumError>`
- **Wire**: `POST /api/policy/capture`
- **Auth**: none — public; no credential is sent
- **Request body**: `application/json` — the `body` field
- **SDK-sent**: `header Idempotency-Key` (minted per call)
- **Returns**: `ApiPolicyCaptureResponse`
- **Error**: `BondedApiError` with `kind: "api"`, an instance of `Policies.CapturePremiumError` — **typed arms**, narrowed on `err.payload.kind`
- **Error arms**: `"error"` [400] `Error` · `"error2"` [409] `Error` · `"undeclared"` [any other] `rawBody: ArrayBuffer`

**Fields** — `Policies.CapturePremiumRequest` (1):

| Field | Channel | Type | Req |
| --- | --- | --- | --- |
| `body` | `body` | `ApiPolicyCaptureRequest` | yes |

| Type | Schema value | Source |
| --- | --- | --- |
| `ApiPolicyCaptureRequest` | `apiPolicyCaptureRequestSchema` | `src/models/api-policy-capture-request.ts` |
| `ApiPolicyCaptureResponse` | `apiPolicyCaptureResponseSchema` | `src/models/api-policy-capture-response.ts` |
| `Error` | `errorSchema` | `src/models/error.ts` |

### createPremiumOrder

- **Signature**: `createPremiumOrder(request: Policies.CreatePremiumOrderRequest, options?: RequestOptions): ApiPromise<ApiPolicyOrderResponse, Policies.CreatePremiumOrderError>`
- **Wire**: `POST /api/policy/order`
- **Auth**: none — public; no credential is sent
- **Request body**: `application/json` — the `body` field
- **SDK-sent**: `header Idempotency-Key` (minted per call)
- **Returns**: `ApiPolicyOrderResponse`
- **Error**: `BondedApiError` with `kind: "api"`, an instance of `Policies.CreatePremiumOrderError` — **typed arms**, narrowed on `err.payload.kind`
- **Error arms**: `"error"` [400] `Error` · `"error2"` [409] `Error` · `"error3"` [429] `Error` · `"undeclared"` [any other] `rawBody: ArrayBuffer`

**Fields** — `Policies.CreatePremiumOrderRequest` (1):

| Field | Channel | Type | Req |
| --- | --- | --- | --- |
| `body` | `body` | `ApiPolicyOrderRequest` | yes |

| Type | Schema value | Source |
| --- | --- | --- |
| `ApiPolicyOrderRequest` | `apiPolicyOrderRequestSchema` | `src/models/api-policy-order-request.ts` |
| `ApiPolicyOrderResponse` | `apiPolicyOrderResponseSchema` | `src/models/api-policy-order-response.ts` |
| `Error` | `errorSchema` | `src/models/error.ts` |

