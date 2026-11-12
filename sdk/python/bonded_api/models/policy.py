from __future__ import annotations

from pydantic import Field
from typing_extensions import NotRequired, TypedDict

from ..core import UNSET, Optional, SdkBaseModel
from .enums.agent_id import AgentIdOrStr


class Policy(SdkBaseModel):
    id: Optional[int] = UNSET
    agent_id: Optional[AgentIdOrStr] = Field(default=UNSET, alias="agentId")
    model: Optional[str] = UNSET
    cover: Optional[int] = UNSET
    premium: Optional[int] = UNSET
    rate_bps: Optional[int] = Field(default=UNSET, alias="rateBps")
    rate_after: Optional[int] = Field(default=UNSET, alias="rateAfter")
    expected_recipient: Optional[str] = Field(default=UNSET, alias="expectedRecipient")
    actual_recipient: Optional[str] = Field(default=UNSET, alias="actualRecipient")
    """Receiver as recorded by PayPal"""

    breached: Optional[bool] = UNSET
    resolved: Optional[bool] = UNSET
    premium_capture: Optional[str] = Field(default=UNSET, alias="premiumCapture")
    """PayPal capture ID"""

    payout_batch: Optional[str] = Field(default=UNSET, alias="payoutBatch")
    """PayPal payout batch of the agent's payment"""


class PolicyDict(TypedDict):
    id: NotRequired[int]
    agent_id: NotRequired[AgentIdOrStr]
    model: NotRequired[str]
    cover: NotRequired[int]
    premium: NotRequired[int]
    rate_bps: NotRequired[int]
    rate_after: NotRequired[int]
    expected_recipient: NotRequired[str]
    actual_recipient: NotRequired[str]
    breached: NotRequired[bool]
    resolved: NotRequired[bool]
    premium_capture: NotRequired[str]
    payout_batch: NotRequired[str]
