from __future__ import annotations

from uuid import UUID, uuid4

from ..core import (
    ApiResult,
    AsyncRawClient,
    BaseRawResponse,
    RawClient,
    RequestOptionsOrDict,
    async_json_decoder,
    json_body,
    json_decoder,
    param,
    unwrap,
)
from ..errors.capture_premium_error import CapturePremiumErrorBody, capture_premium_error_mapper
from ..errors.create_premium_order_error import CreatePremiumOrderErrorBody, create_premium_order_error_mapper
from ..models.api_policy_capture_request import ApiPolicyCaptureRequest, ApiPolicyCaptureRequestDict
from ..models.api_policy_capture_response import ApiPolicyCaptureResponse
from ..models.api_policy_order_request import ApiPolicyOrderRequest, ApiPolicyOrderRequestDict
from ..models.api_policy_order_response import ApiPolicyOrderResponse
from ..server.server import Server


class Policies:
    def __init__(self, client: RawClient, server: Server) -> None:
        self._with_raw_response = PoliciesWithRawResponse(client, server)

    def capture_premium(
        self,
        body: ApiPolicyCaptureRequest | ApiPolicyCaptureRequestDict,
        *,
        request_options: RequestOptionsOrDict | None = None,
    ) -> ApiPolicyCaptureResponse:
        """Captures the approved PayPal order, binds the policy at the approved price, and starts the insured job.
        Progress arrives on ``/api/events``.

        Args:
            body: The request body.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            Policy bound

        Raises:
            ApiError: Unknown order or malformed body Cover unavailable; no premium was taken ``error`` is ``Error |
                RawError``."""
        return unwrap(self._with_raw_response.capture_premium(body, request_options=request_options))

    def create_premium_order(
        self,
        body: ApiPolicyOrderRequest | ApiPolicyOrderRequestDict,
        *,
        request_options: RequestOptionsOrDict | None = None,
    ) -> ApiPolicyOrderResponse:
        """Prices cover on the agent's next $40.00 job and creates a PayPal Orders v2 order for the premium. The buyer
        approves it in PayPal Checkout.

        Args:
            body: The request body.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            PayPal order created

        Raises:
            ApiError: Unknown agent or malformed body The pool cannot carry this cover Demo rate limit reached ``error``
                is ``Error | RawError``."""
        return unwrap(self._with_raw_response.create_premium_order(body, request_options=request_options))

    @property
    def with_raw_response(self) -> PoliciesWithRawResponse:
        return self._with_raw_response


class AsyncPolicies:
    def __init__(self, client: AsyncRawClient, server: Server) -> None:
        self._with_raw_response = AsyncPoliciesWithRawResponse(client, server)

    async def capture_premium(
        self,
        body: ApiPolicyCaptureRequest | ApiPolicyCaptureRequestDict,
        *,
        request_options: RequestOptionsOrDict | None = None,
    ) -> ApiPolicyCaptureResponse:
        """Captures the approved PayPal order, binds the policy at the approved price, and starts the insured job.
        Progress arrives on ``/api/events``.

        Args:
            body: The request body.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            Policy bound

        Raises:
            ApiError: Unknown order or malformed body Cover unavailable; no premium was taken ``error`` is ``Error |
                RawError``."""
        return unwrap(await self._with_raw_response.capture_premium(body, request_options=request_options))

    async def create_premium_order(
        self,
        body: ApiPolicyOrderRequest | ApiPolicyOrderRequestDict,
        *,
        request_options: RequestOptionsOrDict | None = None,
    ) -> ApiPolicyOrderResponse:
        """Prices cover on the agent's next $40.00 job and creates a PayPal Orders v2 order for the premium. The buyer
        approves it in PayPal Checkout.

        Args:
            body: The request body.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            PayPal order created

        Raises:
            ApiError: Unknown agent or malformed body The pool cannot carry this cover Demo rate limit reached ``error``
                is ``Error | RawError``."""
        return unwrap(await self._with_raw_response.create_premium_order(body, request_options=request_options))

    @property
    def with_raw_response(self) -> AsyncPoliciesWithRawResponse:
        return self._with_raw_response


class PoliciesWithRawResponse(BaseRawResponse[RawClient, Server]):
    def capture_premium(
        self,
        body: ApiPolicyCaptureRequest | ApiPolicyCaptureRequestDict,
        *,
        request_options: RequestOptionsOrDict | None = None,
    ) -> ApiResult[ApiPolicyCaptureResponse, CapturePremiumErrorBody]:
        """Captures the approved PayPal order, binds the policy at the approved price, and starts the insured job.
        Progress arrives on ``/api/events``.

        Args:
            body: The request body.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return self._client.execute(
            http_method="POST",
            url_template=self._server.default("/api/policy/capture"),
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            body=json_body[ApiPolicyCaptureRequest | ApiPolicyCaptureRequestDict](body),
            decoder=json_decoder[ApiPolicyCaptureResponse],
            error_mapper=capture_premium_error_mapper,
            request_options=request_options,
        )

    def create_premium_order(
        self,
        body: ApiPolicyOrderRequest | ApiPolicyOrderRequestDict,
        *,
        request_options: RequestOptionsOrDict | None = None,
    ) -> ApiResult[ApiPolicyOrderResponse, CreatePremiumOrderErrorBody]:
        """Prices cover on the agent's next $40.00 job and creates a PayPal Orders v2 order for the premium. The buyer
        approves it in PayPal Checkout.

        Args:
            body: The request body.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return self._client.execute(
            http_method="POST",
            url_template=self._server.default("/api/policy/order"),
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            body=json_body[ApiPolicyOrderRequest | ApiPolicyOrderRequestDict](body),
            decoder=json_decoder[ApiPolicyOrderResponse],
            error_mapper=create_premium_order_error_mapper,
            request_options=request_options,
        )


class AsyncPoliciesWithRawResponse(BaseRawResponse[AsyncRawClient, Server]):
    async def capture_premium(
        self,
        body: ApiPolicyCaptureRequest | ApiPolicyCaptureRequestDict,
        *,
        request_options: RequestOptionsOrDict | None = None,
    ) -> ApiResult[ApiPolicyCaptureResponse, CapturePremiumErrorBody]:
        """Captures the approved PayPal order, binds the policy at the approved price, and starts the insured job.
        Progress arrives on ``/api/events``.

        Args:
            body: The request body.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return await self._client.execute(
            http_method="POST",
            url_template=self._server.default("/api/policy/capture"),
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            body=json_body[ApiPolicyCaptureRequest | ApiPolicyCaptureRequestDict](body),
            decoder=async_json_decoder[ApiPolicyCaptureResponse],
            error_mapper=capture_premium_error_mapper,
            request_options=request_options,
        )

    async def create_premium_order(
        self,
        body: ApiPolicyOrderRequest | ApiPolicyOrderRequestDict,
        *,
        request_options: RequestOptionsOrDict | None = None,
    ) -> ApiResult[ApiPolicyOrderResponse, CreatePremiumOrderErrorBody]:
        """Prices cover on the agent's next $40.00 job and creates a PayPal Orders v2 order for the premium. The buyer
        approves it in PayPal Checkout.

        Args:
            body: The request body.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return await self._client.execute(
            http_method="POST",
            url_template=self._server.default("/api/policy/order"),
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            body=json_body[ApiPolicyOrderRequest | ApiPolicyOrderRequestDict](body),
            decoder=async_json_decoder[ApiPolicyOrderResponse],
            error_mapper=create_premium_order_error_mapper,
            request_options=request_options,
        )
