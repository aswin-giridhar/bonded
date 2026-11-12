from __future__ import annotations

from pydantic import Field
from typing_extensions import TypedDict

from ..core import SdkBaseModel


class ApiPolicyCaptureResponse(SdkBaseModel):
    policy_id: int = Field(alias="policyId")


class ApiPolicyCaptureResponseDict(TypedDict):
    policy_id: int
