from __future__ import annotations

from ..core import (
    ApiResult,
    AsyncRawClient,
    BaseRawResponse,
    RawClient,
    RequestOptionsOrDict,
    async_json_decoder,
    json_decoder,
    param,
    unwrap,
)
from ..errors.get_quote_error import GetQuoteErrorBody, get_quote_error_mapper
from ..models.enums.agent_id import AgentIdOrStr
from ..models.quote import Quote
from ..server.server import Server


class Quotes:
    def __init__(self, client: RawClient, server: Server) -> None:
        self._with_raw_response = QuotesWithRawResponse(client, server)

    def get_quote(
        self, agent_id: AgentIdOrStr, *, cover: int | None = 4000, request_options: RequestOptionsOrDict | None = None
    ) -> Quote:
        """Returns the rate and premium for insuring a payment of ``cover`` cents made by the given agent, with every
        component of the rate.

        Args:
            agent_id: Value sent with the request.
            cover: Amount to insure, in USD cents.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            Quote

        Raises:
            ApiError: Unknown agent or invalid cover The pool cannot carry this cover ``error`` is ``Error |
                RawError``."""
        return unwrap(self._with_raw_response.get_quote(agent_id, cover=cover, request_options=request_options))

    @property
    def with_raw_response(self) -> QuotesWithRawResponse:
        return self._with_raw_response


class AsyncQuotes:
    def __init__(self, client: AsyncRawClient, server: Server) -> None:
        self._with_raw_response = AsyncQuotesWithRawResponse(client, server)

    async def get_quote(
        self, agent_id: AgentIdOrStr, *, cover: int | None = 4000, request_options: RequestOptionsOrDict | None = None
    ) -> Quote:
        """Returns the rate and premium for insuring a payment of ``cover`` cents made by the given agent, with every
        component of the rate.

        Args:
            agent_id: Value sent with the request.
            cover: Amount to insure, in USD cents.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            Quote

        Raises:
            ApiError: Unknown agent or invalid cover The pool cannot carry this cover ``error`` is ``Error |
                RawError``."""
        return unwrap(await self._with_raw_response.get_quote(agent_id, cover=cover, request_options=request_options))

    @property
    def with_raw_response(self) -> AsyncQuotesWithRawResponse:
        return self._with_raw_response


class QuotesWithRawResponse(BaseRawResponse[RawClient, Server]):
    def get_quote(
        self, agent_id: AgentIdOrStr, *, cover: int | None = 4000, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[Quote, GetQuoteErrorBody]:
        """Returns the rate and premium for insuring a payment of ``cover`` cents made by the given agent, with every
        component of the rate.

        Args:
            agent_id: Value sent with the request.
            cover: Amount to insure, in USD cents.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return self._client.execute(
            http_method="GET",
            url_template=self._server.default("/api/quote"),
            query_params=[param[AgentIdOrStr]("agentId", agent_id), param[int | None]("cover", cover)],
            decoder=json_decoder[Quote],
            error_mapper=get_quote_error_mapper,
            request_options=request_options,
        )


class AsyncQuotesWithRawResponse(BaseRawResponse[AsyncRawClient, Server]):
    async def get_quote(
        self, agent_id: AgentIdOrStr, *, cover: int | None = 4000, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[Quote, GetQuoteErrorBody]:
        """Returns the rate and premium for insuring a payment of ``cover`` cents made by the given agent, with every
        component of the rate.

        Args:
            agent_id: Value sent with the request.
            cover: Amount to insure, in USD cents.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return await self._client.execute(
            http_method="GET",
            url_template=self._server.default("/api/quote"),
            query_params=[param[AgentIdOrStr]("agentId", agent_id), param[int | None]("cover", cover)],
            decoder=async_json_decoder[Quote],
            error_mapper=get_quote_error_mapper,
            request_options=request_options,
        )
