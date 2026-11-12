# Raw Reference

**Raw** endpoints, reached through `with_raw_response`, return `ApiResult[T, E]` and never raise for an API error. For the parsed endpoints, see [API Reference](api-reference.md).

> Source: [BondedApiClient](bonded_api/client.py)

## AttackLab

> Source: [AttackLab](bonded_api/apis/attack_lab.py)

<details>
<summary><code>def set_listing_injection(body: ApiListingRequest | ApiListingRequestDict, *, request_options: RequestOptionsOrDict | None = None) -> ApiResult[ApiListingResponse, SetListingInjectionErrorBody]</code></summary>

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
result = client.attack_lab.with_raw_response.set_listing_injection(ApiListingRequest())
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type ApiListingResponse
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type SetListingInjectionErrorBody
```

**Async**

```python
result = await async_client.attack_lab.with_raw_response.set_listing_injection(ApiListingRequest())
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type ApiListingResponse
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type SetListingInjectionErrorBody
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

**Returns**: <code>[ApiResult](bonded_api/core/results.py)&#91;[ApiListingResponse](bonded_api/models/api_listing_response.py), [SetListingInjectionErrorBody](bonded_api/errors/set_listing_injection_error.py)&#93;</code>

**On `Success`**: `payload` is <code>[ApiListingResponse](bonded_api/models/api_listing_response.py)</code> -- Saved

**On `Failure`**: `error` is <code>[SetListingInjectionErrorBody](bonded_api/errors/set_listing_injection_error.py)</code>

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
<summary><code>def get_book(*, request_options: RequestOptionsOrDict | None = None) -> ApiResult[Book, RawError]</code></summary>

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
result = client.book_api.with_raw_response.get_book()
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type Book
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RawError
```

**Async**

```python
result = await async_client.book_api.with_raw_response.get_book()
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type Book
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RawError
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

**Returns**: <code>[ApiResult](bonded_api/core/results.py)&#91;[Book](bonded_api/models/book.py), [RawError](bonded_api/core/results.py)&#93;</code>

**On `Success`**: `payload` is <code>[Book](bonded_api/models/book.py)</code> -- Current agents, quotes and policies

**On `Failure`**: `error` is <code>[RawError](bonded_api/core/results.py)</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>def stream_events(*, request_options: RequestOptionsOrDict | None = None) -> ApiResult[EventStream[str], RawError]</code></summary>

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
result = client.book_api.with_raw_response.stream_events()
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type EventStream[str]
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RawError
```

**Async**

```python
result = await async_client.book_api.with_raw_response.stream_events()
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type AsyncEventStream[str]
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RawError
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

**Returns**: <code>[ApiResult](bonded_api/core/results.py)&#91;EventStream&#91;str&#93;, [RawError](bonded_api/core/results.py)&#93;</code>

**On `Success`**: `payload` is <code>EventStream&#91;str&#93;</code>, its body not yet read -- Event stream

**On `Failure`**: `error` is <code>[RawError](bonded_api/core/results.py)</code>

</dd>
</dl>

</dd>
</dl>

</details>

## Policies

> Source: [Policies](bonded_api/apis/policies.py)

<details>
<summary><code>def capture_premium(body: ApiPolicyCaptureRequest | ApiPolicyCaptureRequestDict, *, request_options: RequestOptionsOrDict | None = None) -> ApiResult[ApiPolicyCaptureResponse, CapturePremiumErrorBody]</code></summary>

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
result = client.policies.with_raw_response.capture_premium(ApiPolicyCaptureRequest(order_id="some example string"))
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type ApiPolicyCaptureResponse
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type CapturePremiumErrorBody
```

**Async**

```python
result = await async_client.policies.with_raw_response.capture_premium(
    ApiPolicyCaptureRequest(order_id="some example string")
)
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type ApiPolicyCaptureResponse
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type CapturePremiumErrorBody
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

**Returns**: <code>[ApiResult](bonded_api/core/results.py)&#91;[ApiPolicyCaptureResponse](bonded_api/models/api_policy_capture_response.py), [CapturePremiumErrorBody](bonded_api/errors/capture_premium_error.py)&#93;</code>

**On `Success`**: `payload` is <code>[ApiPolicyCaptureResponse](bonded_api/models/api_policy_capture_response.py)</code> -- Policy bound

**On `Failure`**: `error` is <code>[CapturePremiumErrorBody](bonded_api/errors/capture_premium_error.py)</code>

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
<summary><code>def create_premium_order(body: ApiPolicyOrderRequest | ApiPolicyOrderRequestDict, *, request_options: RequestOptionsOrDict | None = None) -> ApiResult[ApiPolicyOrderResponse, CreatePremiumOrderErrorBody]</code></summary>

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
result = client.policies.with_raw_response.create_premium_order(ApiPolicyOrderRequest(agent_id=AgentId.PROCURE_V1))
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type ApiPolicyOrderResponse
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type CreatePremiumOrderErrorBody
```

**Async**

```python
result = await async_client.policies.with_raw_response.create_premium_order(
    ApiPolicyOrderRequest(agent_id=AgentId.PROCURE_V1)
)
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type ApiPolicyOrderResponse
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type CreatePremiumOrderErrorBody
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

**Returns**: <code>[ApiResult](bonded_api/core/results.py)&#91;[ApiPolicyOrderResponse](bonded_api/models/api_policy_order_response.py), [CreatePremiumOrderErrorBody](bonded_api/errors/create_premium_order_error.py)&#93;</code>

**On `Success`**: `payload` is <code>[ApiPolicyOrderResponse](bonded_api/models/api_policy_order_response.py)</code> -- PayPal order created

**On `Failure`**: `error` is <code>[CreatePremiumOrderErrorBody](bonded_api/errors/create_premium_order_error.py)</code>

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
<summary><code>def get_quote(agent_id: AgentIdOrStr, *, cover: int | None = 4000, request_options: RequestOptionsOrDict | None = None) -> ApiResult[Quote, GetQuoteErrorBody]</code></summary>

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
result = client.quotes.with_raw_response.get_quote(AgentId.PROCURE_V1)
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type Quote
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type GetQuoteErrorBody
```

**Async**

```python
result = await async_client.quotes.with_raw_response.get_quote(AgentId.PROCURE_V1)
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type Quote
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type GetQuoteErrorBody
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

**Returns**: <code>[ApiResult](bonded_api/core/results.py)&#91;[Quote](bonded_api/models/quote.py), [GetQuoteErrorBody](bonded_api/errors/get_quote_error.py)&#93;</code>

**On `Success`**: `payload` is <code>[Quote](bonded_api/models/quote.py)</code> -- Quote

**On `Failure`**: `error` is <code>[GetQuoteErrorBody](bonded_api/errors/get_quote_error.py)</code>

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

