# Reference

**Parsed** endpoints return the typed payload and raise `ApiError` on a documented non-2xx. For the raw endpoints, see [Raw API Reference](raw-api-reference.md).

> Source: [BondedApiClient](bonded_api/client.py)

## AttackLab

> Source: [AttackLab](bonded_api/apis/attack_lab.py)

<details>
<summary><code>def set_listing_injection(body: ApiListingRequest | ApiListingRequestDict, *, request_options: RequestOptionsOrDict | None = None) -> ApiListingResponse</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Send a `POST` request.

</dd>
</dl>

### Usage

<dl>
<dd>

**Sync**

```python
try:
    response = client.attack_lab.set_listing_injection(ApiListingRequest())
    # TODO: Handle 'response' of type ApiListingResponse
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type SetListingInjectionErrorBody
```

**Async**

```python
try:
    response = await async_client.attack_lab.set_listing_injection(ApiListingRequest())
    # TODO: Handle 'response' of type ApiListingResponse
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type SetListingInjectionErrorBody
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>body</code> | <code>[ApiListingRequest](bonded_api/models/api_listing_request.py) \| [ApiListingRequestDict](bonded_api/models/api_listing_request.py)</code> | The request body. |
| <code>request_options</code> | <code>[RequestOptionsOrDict](bonded_api/core/request_options.py) \| None</code> | Per-call overrides for this one request, such as a timeout, extra headers, or its retry count and statuses. |

</dd>
</dl>

### Response

<dl>
<dd>

**OnSuccess**: <code>[ApiListingResponse](bonded_api/models/api_listing_response.py)</code> -- Saved

**OnError**: <code>[ApiError](bonded_api/core/exceptions.py)&#91;[SetListingInjectionErrorBody](bonded_api/errors/set_listing_injection_error.py)&#93;</code>

Mapped in first-match order -- an earlier row wins over a later range that also covers the status:

| Status | `error` is |
| --- | --- |
| 400 | <code>[Error](bonded_api/models/error.py)</code> |
| anything unmapped | <code>[RawError](bonded_api/core/results.py)</code> |

</dd>
</dl>

</dd>
</dl>

</details>

## BookApi

> Source: [BookApi](bonded_api/apis/book_api.py)

<details>
<summary><code>def get_book(*, request_options: RequestOptionsOrDict | None = None) -> Book</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Send a `GET` request.

</dd>
</dl>

### Usage

<dl>
<dd>

**Sync**

```python
try:
    response = client.book_api.get_book()
    # TODO: Handle 'response' of type Book
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type RawError
```

**Async**

```python
try:
    response = await async_client.book_api.get_book()
    # TODO: Handle 'response' of type Book
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type RawError
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>request_options</code> | <code>[RequestOptionsOrDict](bonded_api/core/request_options.py) \| None</code> | Per-call overrides for this one request, such as a timeout, extra headers, or its retry count and statuses. |

</dd>
</dl>

### Response

<dl>
<dd>

**OnSuccess**: <code>[Book](bonded_api/models/book.py)</code> -- Current agents, quotes and policies

**OnError**: <code>[ApiError](bonded_api/core/exceptions.py)&#91;[RawError](bonded_api/core/results.py)&#93;</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>def stream_events(*, request_options: RequestOptionsOrDict | None = None) -> EventStream[str]</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Every PayPal call and model decision, as `text/event-stream`. Each `data:` line is an Event.

</dd>
</dl>

### Usage

<dl>
<dd>

**Sync**

```python
try:
    response = client.book_api.stream_events()
    # TODO: Handle 'response' of type EventStream[str]
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type RawError
```

**Async**

```python
try:
    response = await async_client.book_api.stream_events()
    # TODO: Handle 'response' of type AsyncEventStream[str]
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type RawError
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>request_options</code> | <code>[RequestOptionsOrDict](bonded_api/core/request_options.py) \| None</code> | Per-call overrides for this one request, such as a timeout, extra headers, or its retry count and statuses. |

</dd>
</dl>

### Response

<dl>
<dd>

**OnSuccess**: <code>EventStream&#91;str&#93;</code> -- Event stream

**OnError**: <code>[ApiError](bonded_api/core/exceptions.py)&#91;[RawError](bonded_api/core/results.py)&#93;</code>

</dd>
</dl>

</dd>
</dl>

</details>

## Policies

> Source: [Policies](bonded_api/apis/policies.py)

<details>
<summary><code>def capture_premium(body: ApiPolicyCaptureRequest | ApiPolicyCaptureRequestDict, *, request_options: RequestOptionsOrDict | None = None) -> ApiPolicyCaptureResponse</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Captures the approved PayPal order, binds the policy at the approved price, and starts the insured job. Progress arrives on `/api/events`.

</dd>
</dl>

### Usage

<dl>
<dd>

**Sync**

```python
try:
    response = client.policies.capture_premium(ApiPolicyCaptureRequest(order_id="some example string"))
    # TODO: Handle 'response' of type ApiPolicyCaptureResponse
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type CapturePremiumErrorBody
```

**Async**

```python
try:
    response = await async_client.policies.capture_premium(ApiPolicyCaptureRequest(order_id="some example string"))
    # TODO: Handle 'response' of type ApiPolicyCaptureResponse
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type CapturePremiumErrorBody
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>body</code> | <code>[ApiPolicyCaptureRequest](bonded_api/models/api_policy_capture_request.py) \| [ApiPolicyCaptureRequestDict](bonded_api/models/api_policy_capture_request.py)</code> | The request body. |
| <code>request_options</code> | <code>[RequestOptionsOrDict](bonded_api/core/request_options.py) \| None</code> | Per-call overrides for this one request, such as a timeout, extra headers, or its retry count and statuses. |

</dd>
</dl>

### Response

<dl>
<dd>

**OnSuccess**: <code>[ApiPolicyCaptureResponse](bonded_api/models/api_policy_capture_response.py)</code> -- Policy bound

**OnError**: <code>[ApiError](bonded_api/core/exceptions.py)&#91;[CapturePremiumErrorBody](bonded_api/errors/capture_premium_error.py)&#93;</code>

Mapped in first-match order -- an earlier row wins over a later range that also covers the status:

| Status | `error` is |
| --- | --- |
| 400, 409 | <code>[Error](bonded_api/models/error.py)</code> |
| anything unmapped | <code>[RawError](bonded_api/core/results.py)</code> |

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>def create_premium_order(body: ApiPolicyOrderRequest | ApiPolicyOrderRequestDict, *, request_options: RequestOptionsOrDict | None = None) -> ApiPolicyOrderResponse</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Prices cover on the agent's next $40.00 job and creates a PayPal Orders v2 order for the premium. The buyer approves it in PayPal Checkout.

</dd>
</dl>

### Usage

<dl>
<dd>

**Sync**

```python
try:
    response = client.policies.create_premium_order(ApiPolicyOrderRequest(agent_id=AgentId.PROCURE_V1))
    # TODO: Handle 'response' of type ApiPolicyOrderResponse
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type CreatePremiumOrderErrorBody
```

**Async**

```python
try:
    response = await async_client.policies.create_premium_order(ApiPolicyOrderRequest(agent_id=AgentId.PROCURE_V1))
    # TODO: Handle 'response' of type ApiPolicyOrderResponse
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type CreatePremiumOrderErrorBody
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>body</code> | <code>[ApiPolicyOrderRequest](bonded_api/models/api_policy_order_request.py) \| [ApiPolicyOrderRequestDict](bonded_api/models/api_policy_order_request.py)</code> | The request body. |
| <code>request_options</code> | <code>[RequestOptionsOrDict](bonded_api/core/request_options.py) \| None</code> | Per-call overrides for this one request, such as a timeout, extra headers, or its retry count and statuses. |

</dd>
</dl>

### Response

<dl>
<dd>

**OnSuccess**: <code>[ApiPolicyOrderResponse](bonded_api/models/api_policy_order_response.py)</code> -- PayPal order created

**OnError**: <code>[ApiError](bonded_api/core/exceptions.py)&#91;[CreatePremiumOrderErrorBody](bonded_api/errors/create_premium_order_error.py)&#93;</code>

Mapped in first-match order -- an earlier row wins over a later range that also covers the status:

| Status | `error` is |
| --- | --- |
| 400, 409, 429 | <code>[Error](bonded_api/models/error.py)</code> |
| anything unmapped | <code>[RawError](bonded_api/core/results.py)</code> |

</dd>
</dl>

</dd>
</dl>

</details>

## Quotes

> Source: [Quotes](bonded_api/apis/quotes.py)

<details>
<summary><code>def get_quote(agent_id: AgentIdOrStr, *, cover: int | None = 4000, request_options: RequestOptionsOrDict | None = None) -> Quote</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Returns the rate and premium for insuring a payment of `cover` cents made by the given agent, with every component of the rate.

</dd>
</dl>

### Usage

<dl>
<dd>

**Sync**

```python
try:
    response = client.quotes.get_quote(AgentId.PROCURE_V1)
    # TODO: Handle 'response' of type Quote
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type GetQuoteErrorBody
```

**Async**

```python
try:
    response = await async_client.quotes.get_quote(AgentId.PROCURE_V1)
    # TODO: Handle 'response' of type Quote
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type GetQuoteErrorBody
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>agent_id</code> | <code>[AgentIdOrStr](bonded_api/models/enums/agent_id.py)</code> | Value sent with the request. |
| <code>cover</code> | <code>int \| None</code> | Amount to insure, in USD cents.<br>**Default**: <code>4000</code> |
| <code>request_options</code> | <code>[RequestOptionsOrDict](bonded_api/core/request_options.py) \| None</code> | Per-call overrides for this one request, such as a timeout, extra headers, or its retry count and statuses. |

</dd>
</dl>

### Response

<dl>
<dd>

**OnSuccess**: <code>[Quote](bonded_api/models/quote.py)</code> -- Quote

**OnError**: <code>[ApiError](bonded_api/core/exceptions.py)&#91;[GetQuoteErrorBody](bonded_api/errors/get_quote_error.py)&#93;</code>

Mapped in first-match order -- an earlier row wins over a later range that also covers the status:

| Status | `error` is |
| --- | --- |
| 400, 409 | <code>[Error](bonded_api/models/error.py)</code> |
| anything unmapped | <code>[RawError](bonded_api/core/results.py)</code> |

</dd>
</dl>

</dd>
</dl>

</details>

