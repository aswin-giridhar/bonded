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
from ..errors.set_listing_injection_error import SetListingInjectionErrorBody, set_listing_injection_error_mapper
from ..models.api_listing_request import ApiListingRequest, ApiListingRequestDict
from ..models.api_listing_response import ApiListingResponse
from ..server.server import Server


class AttackLab:
    def __init__(self, client: RawClient, server: Server) -> None:
        self._with_raw_response = AttackLabWithRawResponse(client, server)

    def set_listing_injection(
        self, body: ApiListingRequest | ApiListingRequestDict, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiListingResponse:
        """Send a ``POST`` request.

        Args:
            body: The request body.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            Saved

        Raises:
            ApiError: Empty or too long ``error`` is ``Error | RawError``."""
        return unwrap(self._with_raw_response.set_listing_injection(body, request_options=request_options))

    @property
    def with_raw_response(self) -> AttackLabWithRawResponse:
        return self._with_raw_response


class AsyncAttackLab:
    def __init__(self, client: AsyncRawClient, server: Server) -> None:
        self._with_raw_response = AsyncAttackLabWithRawResponse(client, server)

    async def set_listing_injection(
        self, body: ApiListingRequest | ApiListingRequestDict, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiListingResponse:
        """Send a ``POST`` request.

        Args:
            body: The request body.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            Saved

        Raises:
            ApiError: Empty or too long ``error`` is ``Error | RawError``."""
        return unwrap(await self._with_raw_response.set_listing_injection(body, request_options=request_options))

    @property
    def with_raw_response(self) -> AsyncAttackLabWithRawResponse:
        return self._with_raw_response


class AttackLabWithRawResponse(BaseRawResponse[RawClient, Server]):
    def set_listing_injection(
        self, body: ApiListingRequest | ApiListingRequestDict, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[ApiListingResponse, SetListingInjectionErrorBody]:
        """Send a ``POST`` request.

        Args:
            body: The request body.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return self._client.execute(
            http_method="POST",
            url_template=self._server.default("/api/listing"),
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            body=json_body[ApiListingRequest | ApiListingRequestDict](body),
            decoder=json_decoder[ApiListingResponse],
            error_mapper=set_listing_injection_error_mapper,
            request_options=request_options,
        )


class AsyncAttackLabWithRawResponse(BaseRawResponse[AsyncRawClient, Server]):
    async def set_listing_injection(
        self, body: ApiListingRequest | ApiListingRequestDict, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[ApiListingResponse, SetListingInjectionErrorBody]:
        """Send a ``POST`` request.

        Args:
            body: The request body.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return await self._client.execute(
            http_method="POST",
            url_template=self._server.default("/api/listing"),
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            body=json_body[ApiListingRequest | ApiListingRequestDict](body),
            decoder=async_json_decoder[ApiListingResponse],
            error_mapper=set_listing_injection_error_mapper,
            request_options=request_options,
        )
