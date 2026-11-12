from enum import Enum
from typing import Annotated, TypeAlias

from ...core import open_enum_validator


class AgentId(str, Enum):
    PROCURE_V1 = "procure-v1"
    PROCURE_V2 = "procure-v2"
    PROCURE_V3 = "procure-v3"

    __str__ = str.__str__


AgentIdOrStr: TypeAlias = Annotated[AgentId | str, open_enum_validator(AgentId)]
