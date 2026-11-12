from __future__ import annotations

from typing_extensions import NotRequired, TypedDict

from ..core import UNSET, Optional, SdkBaseModel


class ApiListingResponse(SdkBaseModel):
    ok: Optional[bool] = UNSET


class ApiListingResponseDict(TypedDict):
    ok: NotRequired[bool]
