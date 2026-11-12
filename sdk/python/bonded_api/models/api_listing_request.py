from __future__ import annotations

from typing_extensions import NotRequired, TypedDict

from ..core import UNSET, Optional, SdkBaseModel


class ApiListingRequest(SdkBaseModel):
    injection: Optional[str] = UNSET
    reset: Optional[bool] = UNSET


class ApiListingRequestDict(TypedDict):
    injection: NotRequired[str]
    reset: NotRequired[bool]
