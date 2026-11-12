<!-- Generated file — do not edit; regenerated with the SDK. -->

# Quotes — operations

Accessor: `client.quotes` · Source: `src/resources/quotes.ts` · 1 operation · Request and error types: namespace `Quotes`

**Type sources**: every type an operation names, with the file that declares it and the schema value exported beside it. Import every name from `bonded-api`; the `Source` path is where to **read** the shape, never what to import. `ApiError`, the runtime error family and the file vocabulary are excluded — see sdk-map.md.

### getQuote

- **Signature**: `getQuote(request: Quotes.GetQuoteRequest, options?: RequestOptions): ApiPromise<Quote, Quotes.GetQuoteError>`
- **Wire**: `GET /api/quote`
- **Auth**: none — public; no credential is sent
- **Request body**: none — no `Content-Type` header is sent
- **Returns**: `Quote`
- **Error**: `BondedApiError` with `kind: "api"`, an instance of `Quotes.GetQuoteError` — **typed arms**, narrowed on `err.payload.kind`
- **Error arms**: `"error"` [400] `Error` · `"error2"` [409] `Error` · `"undeclared"` [any other] `rawBody: ArrayBuffer`

**Fields** — `Quotes.GetQuoteRequest` (2):

| Field | Channel | Type | Req | Default |
| --- | --- | --- | --- | --- |
| `agentId` | `query` | `AgentId` | yes | — |
| `cover` | `query` | `number` | no | `4000` |

| Type | Schema value | Source |
| --- | --- | --- |
| `AgentId` | `agentIdSchema` | `src/models/agent-id.ts` |
| `Quote` | `quoteSchema` | `src/models/quote.ts` |
| `Error` | `errorSchema` | `src/models/error.ts` |

