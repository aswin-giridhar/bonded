<!-- Generated file — do not edit; regenerated with the SDK. -->

# Policies — operations

Accessor: `client.policies` · Source: `bonded_api/apis/policies.py` · 2 operations

Each `###` block is one operation and assumes `sdk-map.md` is loaded: blocks omit what its invariants table covers and are otherwise self-contained, so chunk at block level. Signatures are the sync parsed spelling; the async and raw spellings take the same parameters (see sdk-map.md). **Type sources** names the module declaring each type an operation mentions, so resolving a body, return or error payload is a lookup rather than a search; the runtime types `RawError` and `ApiResult` are excluded.

### client.policies.capture_premium

- **Route**: `POST /api/policy/capture`
- **Signature**: `def capture_premium(body: ApiPolicyCaptureRequest | ApiPolicyCaptureRequestDict, *, request_options: RequestOptionsOrDict | None = None)`
  - required, positional: `body`
- **Params**: `body` — JSON body
- **Returns (parsed)**: `ApiPolicyCaptureResponse`
- **Returns (raw)**: `ApiResult[ApiPolicyCaptureResponse, CapturePremiumErrorBody]`
- **Error**: `CapturePremiumErrorBody` — **Case A (typed)**
- **Error arms**: `Error` [400, 409] · `RawError` [anything unmapped]

| Type | Source |
| --- | --- |
| `ApiPolicyCaptureRequest` | `bonded_api/models/api_policy_capture_request.py` |
| `ApiPolicyCaptureRequestDict` | `bonded_api/models/api_policy_capture_request.py` |
| `ApiPolicyCaptureResponse` | `bonded_api/models/api_policy_capture_response.py` |
| `CapturePremiumErrorBody` | `bonded_api/errors/capture_premium_error.py` |
| `Error` | `bonded_api/models/error.py` |

### client.policies.create_premium_order

- **Route**: `POST /api/policy/order`
- **Signature**: `def create_premium_order(body: ApiPolicyOrderRequest | ApiPolicyOrderRequestDict, *, request_options: RequestOptionsOrDict | None = None)`
  - required, positional: `body`
- **Params**: `body` — JSON body
- **Returns (parsed)**: `ApiPolicyOrderResponse`
- **Returns (raw)**: `ApiResult[ApiPolicyOrderResponse, CreatePremiumOrderErrorBody]`
- **Error**: `CreatePremiumOrderErrorBody` — **Case A (typed)**
- **Error arms**: `Error` [400, 409, 429] · `RawError` [anything unmapped]

| Type | Source |
| --- | --- |
| `ApiPolicyOrderRequest` | `bonded_api/models/api_policy_order_request.py` |
| `ApiPolicyOrderRequestDict` | `bonded_api/models/api_policy_order_request.py` |
| `ApiPolicyOrderResponse` | `bonded_api/models/api_policy_order_response.py` |
| `CreatePremiumOrderErrorBody` | `bonded_api/errors/create_premium_order_error.py` |
| `Error` | `bonded_api/models/error.py` |

