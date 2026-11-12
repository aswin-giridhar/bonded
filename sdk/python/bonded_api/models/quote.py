from __future__ import annotations

from pydantic import Field
from typing_extensions import NotRequired, TypedDict

from ..core import UNSET, Optional, SdkBaseModel
from .enums.agent_id import AgentIdOrStr
from .rate_components import RateComponents, RateComponentsDict


class Quote(SdkBaseModel):
    agent_id: AgentIdOrStr = Field(alias="agentId")
    model: Optional[str] = UNSET
    cover: int
    """USD cents"""

    currency: Optional[str] = UNSET
    rate_bps: int = Field(alias="rateBps")
    premium: int
    """USD cents"""

    components: Optional[RateComponents] = UNSET
    """Rate components in basis points."""

    trials: Optional[int] = UNSET
    failures: Optional[int] = UNSET
    credibility_pct: Optional[float] = Field(default=UNSET, alias="credibilityPct")


class QuoteDict(TypedDict):
    agent_id: AgentIdOrStr
    model: NotRequired[str]
    cover: int
    currency: NotRequired[str]
    rate_bps: int
    premium: int
    components: NotRequired[RateComponentsDict]
    trials: NotRequired[int]
    failures: NotRequired[int]
    credibility_pct: NotRequired[float]
