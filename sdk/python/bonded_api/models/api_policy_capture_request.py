from __future__ import annotations

from pydantic import Field
from typing_extensions import TypedDict

from ..core import SdkBaseModel


class ApiPolicyCaptureRequest(SdkBaseModel):
    order_id: str = Field(alias="orderId")


class ApiPolicyCaptureRequestDict(TypedDict):
    order_id: str
