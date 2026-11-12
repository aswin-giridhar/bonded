<!-- Generated file — do not edit; regenerated with the SDK. -->

# AttackLab — operations

Accessor: `client.attack_lab` · Source: `bonded_api/apis/attack_lab.py` · 1 operation

Each `###` block is one operation and assumes `sdk-map.md` is loaded: blocks omit what its invariants table covers and are otherwise self-contained, so chunk at block level. Signatures are the sync parsed spelling; the async and raw spellings take the same parameters (see sdk-map.md). **Type sources** names the module declaring each type an operation mentions, so resolving a body, return or error payload is a lookup rather than a search; the runtime types `RawError` and `ApiResult` are excluded.

### client.attack_lab.set_listing_injection

- **Route**: `POST /api/listing`
- **Signature**: `def set_listing_injection(body: ApiListingRequest | ApiListingRequestDict, *, request_options: RequestOptionsOrDict | None = None)`
  - required, positional: `body`
- **Params**: `body` — JSON body
- **Returns (parsed)**: `ApiListingResponse`
- **Returns (raw)**: `ApiResult[ApiListingResponse, SetListingInjectionErrorBody]`
- **Error**: `SetListingInjectionErrorBody` — **Case A (typed)**
- **Error arms**: `Error` [400] · `RawError` [anything unmapped]

| Type | Source |
| --- | --- |
| `ApiListingRequest` | `bonded_api/models/api_listing_request.py` |
| `ApiListingRequestDict` | `bonded_api/models/api_listing_request.py` |
| `ApiListingResponse` | `bonded_api/models/api_listing_response.py` |
| `SetListingInjectionErrorBody` | `bonded_api/errors/set_listing_injection_error.py` |
| `Error` | `bonded_api/models/error.py` |

