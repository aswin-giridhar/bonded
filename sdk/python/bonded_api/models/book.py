from __future__ import annotations

from pydantic import Field
from typing_extensions import NotRequired, TypedDict

from ..core import UNSET, Optional, SdkBaseModel
from .agent import Agent, AgentDict
from .policy import Policy, PolicyDict


class Book(SdkBaseModel):
    cover: Optional[int] = UNSET
    vendor: Optional[str] = UNSET
    book_capital: Optional[int] = Field(default=UNSET, alias="bookCapital")
    book_exposure: Optional[int] = Field(default=UNSET, alias="bookExposure")
    agents: Optional[list[Agent]] = UNSET
    policies: Optional[list[Policy]] = UNSET


class BookDict(TypedDict):
    cover: NotRequired[int]
    vendor: NotRequired[str]
    book_capital: NotRequired[int]
    book_exposure: NotRequired[int]
    agents: NotRequired[list[AgentDict]]
    policies: NotRequired[list[PolicyDict]]
