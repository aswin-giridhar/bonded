<!-- Generated file — do not edit; regenerated with the SDK. -->

# AttackLab — operations

Accessor: `client.attackLab` · Source: `src/resources/attack-lab.ts` · 1 operation · Request and error types: namespace `AttackLab`

**Type sources**: every type an operation names, with the file that declares it and the schema value exported beside it. Import every name from `bonded-api`; the `Source` path is where to **read** the shape, never what to import. `ApiError`, the runtime error family and the file vocabulary are excluded — see sdk-map.md.

### setListingInjection

- **Signature**: `setListingInjection(request: AttackLab.SetListingInjectionRequest, options?: RequestOptions): ApiPromise<ApiListingResponse, AttackLab.SetListingInjectionError>`
- **Wire**: `POST /api/listing`
- **Auth**: none — public; no credential is sent
- **Request body**: `application/json` — the `body` field
- **SDK-sent**: `header Idempotency-Key` (minted per call)
- **Returns**: `ApiListingResponse`
- **Error**: `BondedApiError` with `kind: "api"`, an instance of `AttackLab.SetListingInjectionError` — **typed arms**, narrowed on `err.payload.kind`
- **Error arms**: `"error"` [400] `Error` · `"undeclared"` [any other] `rawBody: ArrayBuffer`

**Fields** — `AttackLab.SetListingInjectionRequest` (1):

| Field | Channel | Type | Req |
| --- | --- | --- | --- |
| `body` | `body` | `ApiListingRequest` | yes |

| Type | Schema value | Source |
| --- | --- | --- |
| `ApiListingRequest` | `apiListingRequestSchema` | `src/models/api-listing-request.ts` |
| `ApiListingResponse` | `apiListingResponseSchema` | `src/models/api-listing-response.ts` |
| `Error` | `errorSchema` | `src/models/error.ts` |

