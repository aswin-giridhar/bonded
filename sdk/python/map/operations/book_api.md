<!-- Generated file — do not edit; regenerated with the SDK. -->

# BookApi — operations

Accessor: `client.book_api` · Source: `bonded_api/apis/book_api.py` · 2 operations

Each `###` block is one operation and assumes `sdk-map.md` is loaded: blocks omit what its invariants table covers and are otherwise self-contained, so chunk at block level. Signatures are the sync parsed spelling; the async and raw spellings take the same parameters (see sdk-map.md). **Type sources** names the module declaring each type an operation mentions, so resolving a body, return or error payload is a lookup rather than a search; the runtime types `RawError` and `ApiResult` are excluded, and an operation with no table mentions nothing but builtins and those.

### client.book_api.get_book

- **Route**: `GET /api/state`
- **Signature**: `def get_book(*, request_options: RequestOptionsOrDict | None = None)`
- **Returns (parsed)**: `Book`
- **Returns (raw)**: `ApiResult[Book, RawError]`
- **Error**: `RawError` — **Case B**

| Type | Source |
| --- | --- |
| `Book` | `bonded_api/models/book.py` |

### client.book_api.stream_events

- **Route**: `GET /api/events`
- **Signature**: `def stream_events(*, request_options: RequestOptionsOrDict | None = None)`
- **Returns (parsed)**: `EventStream[str]`
- **Returns (raw)**: `ApiResult[EventStream[str], RawError]`
- **Error**: `RawError` — **Case B**

