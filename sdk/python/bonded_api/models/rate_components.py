from __future__ import annotations

from typing_extensions import NotRequired, TypedDict

from ..core import UNSET, Optional, SdkBaseModel


class RateComponents(SdkBaseModel):
    """Rate components in basis points."""

    base: Optional[int] = UNSET
    experience: Optional[int] = UNSET
    """Observed loss record, credibility weighted"""

    unproven: Optional[int] = UNSET
    """Loading for missing track record"""

    utilisation: Optional[int] = UNSET
    concentration: Optional[int] = UNSET
    """Surcharge for exposure concentrated on one model"""


class RateComponentsDict(TypedDict):
    base: NotRequired[int]
    experience: NotRequired[int]
    unproven: NotRequired[int]
    utilisation: NotRequired[int]
    concentration: NotRequired[int]
