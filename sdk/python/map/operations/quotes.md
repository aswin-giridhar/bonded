<!-- Generated file — do not edit; regenerated with the SDK. -->

# Quotes — operations

Accessor: `client.quotes` · Source: `bonded_api/apis/quotes.py` · 1 operation

Each `###` block is one operation and assumes `sdk-map.md` is loaded: blocks omit what its invariants table covers and are otherwise self-contained, so chunk at block level. Signatures are the sync parsed spelling; the async and raw spellings take the same parameters (see sdk-map.md). **Type sources** names the module declaring each type an operation mentions, so resolving a body, return or error payload is a lookup rather than a search; the runtime types `RawError` and `ApiResult` are excluded.

### client.quotes.get_quote

- **Route**: `GET /api/quote`
- **Signature**: `def get_quote(agent_id: AgentIdOrStr, *, cover: int | None = 4000, request_options: RequestOptionsOrDict | None = None)`
  - required, positional: `agent_id`
- **Params**: `agent_id` — query `agentId` · `cover` — query
- **Returns (parsed)**: `Quote`
- **Returns (raw)**: `ApiResult[Quote, GetQuoteErrorBody]`
- **Error**: `GetQuoteErrorBody` — **Case A (typed)**
- **Error arms**: `Error` [400, 409] · `RawError` [anything unmapped]

| Type | Source |
| --- | --- |
| `AgentIdOrStr` | `bonded_api/models/enums/agent_id.py` |
| `Quote` | `bonded_api/models/quote.py` |
| `GetQuoteErrorBody` | `bonded_api/errors/get_quote_error.py` |
| `Error` | `bonded_api/models/error.py` |

