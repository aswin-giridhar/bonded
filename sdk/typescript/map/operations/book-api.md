<!-- Generated file — do not edit; regenerated with the SDK. -->

# BookApi — operations

Accessor: `client.bookApi` · Source: `src/resources/book-api.ts` · 2 operations · Request types: namespace `BookApi`

**Type sources**: every type an operation names, with the file that declares it and the schema value exported beside it. Import every name from `bonded-api`; the `Source` path is where to **read** the shape, never what to import. `ApiError`, the runtime error family and the file vocabulary are excluded — see sdk-map.md. Reading a stream raises the same family: `DecodeError` for data that will not decode, `ConnectionError` for a connection that fails, `TimeoutError` when the server stays silent past `eventStream.idleTimeout`.

### getBook

- **Signature**: `getBook(options?: RequestOptions): ApiPromise<Book, ApiError>`
- **Wire**: `GET /api/state`
- **Auth**: none — public; no credential is sent
- **Request body**: none — no `Content-Type` header is sent
- **Returns**: `Book`
- **Error**: `BondedApiError` with `kind: "api"` — untyped, `payload.kind` always `"undeclared"`

| Type | Schema value | Source |
| --- | --- | --- |
| `Book` | `bookSchema` | `src/models/book.ts` |

### streamEvents

- **Signature**: `streamEvents(options?: RequestOptions): ApiPromise<EventStream<string>, ApiError>`
- **Wire**: `GET /api/events`
- **Auth**: none — public; no credential is sent
- **Request body**: none — no `Content-Type` header is sent
- **Returns**: `EventStream<string>` — `text/event-stream`, resolved at the response headers and read one `string` per step, each event's `data`: iterate it once with `for await`, or release it with `await stream.close()`. Every event's `data` is its plain text, whatever the event is named. The stream ends when the server closes it
- **Error**: `BondedApiError` with `kind: "api"` — untyped, `payload.kind` always `"undeclared"`

| Type | Schema value | Source |
| --- | --- | --- |
| `EventStream` | — | `src/core/event-stream.ts` |

