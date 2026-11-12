from __future__ import annotations

from typing_extensions import TypedDict

from ..core import SdkBaseModel


class ApiPolicyOrderResponse(SdkBaseModel):
    id: str
    """PayPal order ID to approve in Checkout"""


class ApiPolicyOrderResponseDict(TypedDict):
    id: str
