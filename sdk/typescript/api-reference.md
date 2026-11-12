# Reference

> Source: [BondedApiClient](src/client.ts)

## Quotes

> Source: [Quotes](src/resources/quotes.ts)

<details>
<summary><code>getQuote(request: Quotes.GetQuoteRequest, options?: RequestOptions): ApiPromise&lt;Quote, Quotes.GetQuoteError&gt;</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Returns the rate and premium for insuring a payment of `cover` cents made by the given agent, with every component of the rate.

</dd>
</dl>

### Direct Usage

<dl>
<dd>

```ts
try {
  const response = await client.quotes.getQuote({ agentId: AgentId.ProcureV1 });
  // TODO: Handle 'response' of type Quote
} catch (err) {
  // TODO: Handle 'err' of type Quotes.GetQuoteError, discriminated with 'err.payload.kind'
}
```

</dd>
</dl>

### Usage as ApiResult

<dl>
<dd>

```ts
const result = await client.quotes.getQuote({ agentId: AgentId.ProcureV1 }).asApiResult();
// TODO: Use 'result.status' and 'result.headers' to read the raw response status and headers
if (result.ok) {
  // TODO: Use 'result.value' of type Quote
} else {
  // TODO: Handle 'result', discriminated with 'result.payload.kind'
}
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>agentId</code> | <code>[AgentId](src/models/agent-id.ts)</code> | - |
| <code>cover?</code> | <code>number</code> | Amount to insure, in USD cents.<br>**Default**: 4000 |

</dd>
</dl>

### Response

<dl>
<dd>

**Direct**: `await client.quotes.getQuote(request)`

- **OnSuccess**: <code>[Quote](src/models/quote.ts)</code>
- **OnError**: throws <code>[Quotes.GetQuoteError](src/resources/quotes.ts)</code>, with `err.payload` discriminated on `kind`

**As ApiResult**: `await client.quotes.getQuote(request).asApiResult()`

- **OnSuccess**: <code>[ApiResult](src/core/api-promise.ts)&lt;Quote, Quotes.GetQuoteError&gt;</code>, with `result.value` of type <code>[Quote](src/models/quote.ts)</code>
- **OnError**: `result.payload` discriminated on `kind`, with `result.message`

**Thrown**: <code>[BondedApiError](src/core/errors.ts)</code> on any operational failure — a caller abort and a programmer error stay outside the family and reach you raw

</dd>
</dl>

</dd>
</dl>

</details>

## Policies

> Source: [Policies](src/resources/policies.ts)

<details>
<summary><code>capturePremium(request: Policies.CapturePremiumRequest, options?: RequestOptions): ApiPromise&lt;ApiPolicyCaptureResponse, Policies.CapturePremiumError&gt;</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Captures the approved PayPal order, binds the policy at the approved price, and starts the insured job. Progress arrives on `/api/events`.

</dd>
</dl>

### Direct Usage

<dl>
<dd>

```ts
try {
  const response = await client.policies.capturePremium({ body: { orderId: "some example string" } });
  // TODO: Handle 'response' of type ApiPolicyCaptureResponse
} catch (err) {
  // TODO: Handle 'err' of type Policies.CapturePremiumError, discriminated with 'err.payload.kind'
}
```

</dd>
</dl>

### Usage as ApiResult

<dl>
<dd>

```ts
const result = await client.policies
  .capturePremium({ body: { orderId: "some example string" } })
  .asApiResult();
// TODO: Use 'result.status' and 'result.headers' to read the raw response status and headers
if (result.ok) {
  // TODO: Use 'result.value' of type ApiPolicyCaptureResponse
} else {
  // TODO: Handle 'result', discriminated with 'result.payload.kind'
}
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>body</code> | <code>[ApiPolicyCaptureRequest](src/models/api-policy-capture-request.ts)</code> | - |

</dd>
</dl>

### Response

<dl>
<dd>

**Direct**: `await client.policies.capturePremium(request)`

- **OnSuccess**: <code>[ApiPolicyCaptureResponse](src/models/api-policy-capture-response.ts)</code>
- **OnError**: throws <code>[Policies.CapturePremiumError](src/resources/policies.ts)</code>, with `err.payload` discriminated on `kind`

**As ApiResult**: `await client.policies.capturePremium(request).asApiResult()`

- **OnSuccess**: <code>[ApiResult](src/core/api-promise.ts)&lt;ApiPolicyCaptureResponse, Policies.CapturePremiumError&gt;</code>, with `result.value` of type <code>[ApiPolicyCaptureResponse](src/models/api-policy-capture-response.ts)</code>
- **OnError**: `result.payload` discriminated on `kind`, with `result.message`

**Thrown**: <code>[BondedApiError](src/core/errors.ts)</code> on any operational failure — a caller abort and a programmer error stay outside the family and reach you raw

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>createPremiumOrder(request: Policies.CreatePremiumOrderRequest, options?: RequestOptions): ApiPromise&lt;ApiPolicyOrderResponse, Policies.CreatePremiumOrderError&gt;</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Prices cover on the agent's next $40.00 job and creates a PayPal Orders v2 order for the premium. The buyer approves it in PayPal Checkout.

</dd>
</dl>

### Direct Usage

<dl>
<dd>

```ts
try {
  const response = await client.policies.createPremiumOrder({ body: { agentId: AgentId.ProcureV1 } });
  // TODO: Handle 'response' of type ApiPolicyOrderResponse
} catch (err) {
  // TODO: Handle 'err' of type Policies.CreatePremiumOrderError, discriminated with 'err.payload.kind'
}
```

</dd>
</dl>

### Usage as ApiResult

<dl>
<dd>

```ts
const result = await client.policies
  .createPremiumOrder({ body: { agentId: AgentId.ProcureV1 } })
  .asApiResult();
// TODO: Use 'result.status' and 'result.headers' to read the raw response status and headers
if (result.ok) {
  // TODO: Use 'result.value' of type ApiPolicyOrderResponse
} else {
  // TODO: Handle 'result', discriminated with 'result.payload.kind'
}
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>body</code> | <code>[ApiPolicyOrderRequest](src/models/api-policy-order-request.ts)</code> | - |

</dd>
</dl>

### Response

<dl>
<dd>

**Direct**: `await client.policies.createPremiumOrder(request)`

- **OnSuccess**: <code>[ApiPolicyOrderResponse](src/models/api-policy-order-response.ts)</code>
- **OnError**: throws <code>[Policies.CreatePremiumOrderError](src/resources/policies.ts)</code>, with `err.payload` discriminated on `kind`

**As ApiResult**: `await client.policies.createPremiumOrder(request).asApiResult()`

- **OnSuccess**: <code>[ApiResult](src/core/api-promise.ts)&lt;ApiPolicyOrderResponse, Policies.CreatePremiumOrderError&gt;</code>, with `result.value` of type <code>[ApiPolicyOrderResponse](src/models/api-policy-order-response.ts)</code>
- **OnError**: `result.payload` discriminated on `kind`, with `result.message`

**Thrown**: <code>[BondedApiError](src/core/errors.ts)</code> on any operational failure — a caller abort and a programmer error stay outside the family and reach you raw

</dd>
</dl>

</dd>
</dl>

</details>

## BookApi

> Source: [BookApi](src/resources/book-api.ts)

<details>
<summary><code>getBook(options?: RequestOptions): ApiPromise&lt;Book, ApiError&gt;</code></summary>

<dl>
<dd>

### Direct Usage

<dl>
<dd>

```ts
try {
  const response = await client.bookApi.getBook();
  // TODO: Handle 'response' of type Book
} catch (err) {
  // TODO: Handle 'err' of type ApiError, where 'err.payload' is always the Undeclared arm
}
```

</dd>
</dl>

### Usage as ApiResult

<dl>
<dd>

```ts
const result = await client.bookApi.getBook().asApiResult();
// TODO: Use 'result.status' and 'result.headers' to read the raw response status and headers
if (result.ok) {
  // TODO: Use 'result.value' of type Book
} else {
  // TODO: Handle 'result', where 'result.payload' is always the Undeclared arm
}
```

</dd>
</dl>

### Response

<dl>
<dd>

**Direct**: `await client.bookApi.getBook()`

- **OnSuccess**: <code>[Book](src/models/book.ts)</code>
- **OnError**: throws <code>[ApiError](src/core/api-error.ts)</code>, with `err.payload` always the <code>[Undeclared](src/core/api-error.ts)</code> arm

**As ApiResult**: `await client.bookApi.getBook().asApiResult()`

- **OnSuccess**: <code>[ApiResult](src/core/api-promise.ts)&lt;Book, ApiError&gt;</code>, with `result.value` of type <code>[Book](src/models/book.ts)</code>
- **OnError**: `result.payload` always the <code>[Undeclared](src/core/api-error.ts)</code> arm, with `result.message`

**Thrown**: <code>[BondedApiError](src/core/errors.ts)</code> on any operational failure — a caller abort and a programmer error stay outside the family and reach you raw

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>streamEvents(options?: RequestOptions): ApiPromise&lt;EventStream&lt;string&gt;, ApiError&gt;</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Every PayPal call and model decision, as `text/event-stream`. Each `data:` line is an Event.

</dd>
</dl>

### Direct Usage

<dl>
<dd>

```ts
try {
  const stream = await client.bookApi.streamEvents();
  for await (const event of stream) {
    // TODO: Handle 'event' of type string, one event's decoded data
  }
} catch (err) {
  // TODO: Handle 'err' of type ApiError, where 'err.payload' is always the Undeclared arm
  // The loop's failures are BondedApiError leaves too: DecodeError, ConnectionError or TimeoutError
}
```

</dd>
</dl>

### Usage as ApiResult

<dl>
<dd>

```ts
const result = await client.bookApi.streamEvents().asApiResult();
// TODO: Use 'result.status' and 'result.headers' to read the raw response status and headers
if (result.ok) {
  // TODO: Use 'result.value' of type EventStream<string>
} else {
  // TODO: Handle 'result', where 'result.payload' is always the Undeclared arm
}
```

</dd>
</dl>

### Response

<dl>
<dd>

**Direct**: `await client.bookApi.streamEvents()`

- **OnSuccess**: <code>[EventStream](src/core/event-stream.ts)&lt;string&gt;</code>
- **OnError**: throws <code>[ApiError](src/core/api-error.ts)</code>, with `err.payload` always the <code>[Undeclared](src/core/api-error.ts)</code> arm

**As ApiResult**: `await client.bookApi.streamEvents().asApiResult()`

- **OnSuccess**: <code>[ApiResult](src/core/api-promise.ts)&lt;EventStream&lt;string&gt;, ApiError&gt;</code>, with `result.value` of type <code>[EventStream](src/core/event-stream.ts)&lt;string&gt;</code>
- **OnError**: `result.payload` always the <code>[Undeclared](src/core/api-error.ts)</code> arm, with `result.message`

**Thrown**: <code>[BondedApiError](src/core/errors.ts)</code> on any operational failure, before the stream is returned and while it is read — a caller abort and a programmer error stay outside the family and reach you raw

</dd>
</dl>

</dd>
</dl>

</details>

## AttackLab

> Source: [AttackLab](src/resources/attack-lab.ts)

<details>
<summary><code>setListingInjection(request: AttackLab.SetListingInjectionRequest, options?: RequestOptions): ApiPromise&lt;ApiListingResponse, AttackLab.SetListingInjectionError&gt;</code></summary>

<dl>
<dd>

### Direct Usage

<dl>
<dd>

```ts
try {
  const response = await client.attackLab.setListingInjection({ body: {} });
  // TODO: Handle 'response' of type ApiListingResponse
} catch (err) {
  // TODO: Handle 'err' of type AttackLab.SetListingInjectionError, discriminated with 'err.payload.kind'
}
```

</dd>
</dl>

### Usage as ApiResult

<dl>
<dd>

```ts
const result = await client.attackLab.setListingInjection({ body: {} }).asApiResult();
// TODO: Use 'result.status' and 'result.headers' to read the raw response status and headers
if (result.ok) {
  // TODO: Use 'result.value' of type ApiListingResponse
} else {
  // TODO: Handle 'result', discriminated with 'result.payload.kind'
}
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>body</code> | <code>[ApiListingRequest](src/models/api-listing-request.ts)</code> | - |

</dd>
</dl>

### Response

<dl>
<dd>

**Direct**: `await client.attackLab.setListingInjection(request)`

- **OnSuccess**: <code>[ApiListingResponse](src/models/api-listing-response.ts)</code>
- **OnError**: throws <code>[AttackLab.SetListingInjectionError](src/resources/attack-lab.ts)</code>, with `err.payload` discriminated on `kind`

**As ApiResult**: `await client.attackLab.setListingInjection(request).asApiResult()`

- **OnSuccess**: <code>[ApiResult](src/core/api-promise.ts)&lt;ApiListingResponse, AttackLab.SetListingInjectionError&gt;</code>, with `result.value` of type <code>[ApiListingResponse](src/models/api-listing-response.ts)</code>
- **OnError**: `result.payload` discriminated on `kind`, with `result.message`

**Thrown**: <code>[BondedApiError](src/core/errors.ts)</code> on any operational failure — a caller abort and a programmer error stay outside the family and reach you raw

</dd>
</dl>

</dd>
</dl>

</details>

