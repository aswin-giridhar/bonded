from __future__ import annotations

from typing_extensions import NotRequired, TypedDict

from ..core import UNSET, Optional, SdkBaseModel
from .enums.agent_id import AgentIdOrStr
from .quote import Quote, QuoteDict


class Agent(SdkBaseModel):
    id: Optional[AgentIdOrStr] = UNSET
    label: Optional[str] = UNSET
    kind: Optional[str] = UNSET
    model: Optional[str] = UNSET
    pool: Optional[int] = UNSET
    exposure: Optional[int] = UNSET
    trials: Optional[int] = UNSET
    failures: Optional[int] = UNSET
    quote: Optional[Quote] = UNSET


class AgentDict(TypedDict):
    id: NotRequired[AgentIdOrStr]
    label: NotRequired[str]
    kind: NotRequired[str]
    model: NotRequired[str]
    pool: NotRequired[int]
    exposure: NotRequired[int]
    trials: NotRequired[int]
    failures: NotRequired[int]
    quote: NotRequired[QuoteDict]
