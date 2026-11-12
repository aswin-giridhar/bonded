from __future__ import annotations

from pydantic import Field
from typing_extensions import TypedDict

from ..core import SdkBaseModel
from .enums.agent_id import AgentIdOrStr


class ApiPolicyOrderRequest(SdkBaseModel):
    agent_id: AgentIdOrStr = Field(alias="agentId")


class ApiPolicyOrderRequestDict(TypedDict):
    agent_id: AgentIdOrStr
