from __future__ import annotations

from ..core import (
    ApiResult,
    AsyncEventStream,
    AsyncRawClient,
    BaseRawResponse,
    EventStream,
    RawClient,
    RawError,
    RequestOptionsOrDict,
    async_json_decoder,
    async_text_event_decoder,
    json_decoder,
    raw_error_response,
    text_event_decoder,
    unwrap,
)
from ..models.book import Book
from ..server.server import Server


class BookApi:
    def __init__(self, client: RawClient, server: Server) -> None:
        self._with_raw_response = BookApiWithRawResponse(client, server)

    def get_book(self, *, request_options: RequestOptionsOrDict | None = None) -> Book:
        """Send a ``GET`` request.

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            Current agents, quotes and policies

        Raises:
            ApiError: If the API responds with an error status code. ``error`` is ``RawError``."""
        return unwrap(self._with_raw_response.get_book(request_options=request_options))

    def stream_events(self, *, request_options: RequestOptionsOrDict | None = None) -> EventStream[str]:
        """Every PayPal call and model decision, as ``text/event-stream``. Each ``data:`` line is an Event.

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            Event stream

        Raises:
            ApiError: If the API responds with an error status code. ``error`` is ``RawError``."""
        return unwrap(self._with_raw_response.stream_events(request_options=request_options))

    @property
    def with_raw_response(self) -> BookApiWithRawResponse:
        return self._with_raw_response


class AsyncBookApi:
    def __init__(self, client: AsyncRawClient, server: Server) -> None:
        self._with_raw_response = AsyncBookApiWithRawResponse(client, server)

    async def get_book(self, *, request_options: RequestOptionsOrDict | None = None) -> Book:
        """Send a ``GET`` request.

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            Current agents, quotes and policies

        Raises:
            ApiError: If the API responds with an error status code. ``error`` is ``RawError``."""
        return unwrap(await self._with_raw_response.get_book(request_options=request_options))

    async def stream_events(self, *, request_options: RequestOptionsOrDict | None = None) -> AsyncEventStream[str]:
        """Every PayPal call and model decision, as ``text/event-stream``. Each ``data:`` line is an Event.

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            Event stream

        Raises:
            ApiError: If the API responds with an error status code. ``error`` is ``RawError``."""
        return unwrap(await self._with_raw_response.stream_events(request_options=request_options))

    @property
    def with_raw_response(self) -> AsyncBookApiWithRawResponse:
        return self._with_raw_response


class BookApiWithRawResponse(BaseRawResponse[RawClient, Server]):
    def get_book(self, *, request_options: RequestOptionsOrDict | None = None) -> ApiResult[Book, RawError]:
        """Send a ``GET`` request.

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return self._client.execute(
            http_method="GET",
            url_template=self._server.default("/api/state"),
            decoder=json_decoder[Book],
            error_mapper=raw_error_response,
            request_options=request_options,
        )

    def stream_events(
        self, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[EventStream[str], RawError]:
        """Every PayPal call and model decision, as ``text/event-stream``. Each ``data:`` line is an Event.

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the body unread or the error body."""
        return self._client.execute(
            http_method="GET",
            url_template=self._server.default("/api/events"),
            decoder=text_event_decoder[str](),
            error_mapper=raw_error_response,
            request_options=request_options,
        )


class AsyncBookApiWithRawResponse(BaseRawResponse[AsyncRawClient, Server]):
    async def get_book(self, *, request_options: RequestOptionsOrDict | None = None) -> ApiResult[Book, RawError]:
        """Send a ``GET`` request.

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return await self._client.execute(
            http_method="GET",
            url_template=self._server.default("/api/state"),
            decoder=async_json_decoder[Book],
            error_mapper=raw_error_response,
            request_options=request_options,
        )

    async def stream_events(
        self, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[AsyncEventStream[str], RawError]:
        """Every PayPal call and model decision, as ``text/event-stream``. Each ``data:`` line is an Event.

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the body unread or the error body."""
        return await self._client.execute(
            http_method="GET",
            url_template=self._server.default("/api/events"),
            decoder=async_text_event_decoder[str](),
            error_mapper=raw_error_response,
            request_options=request_options,
        )
