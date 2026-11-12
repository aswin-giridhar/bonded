from __future__ import annotations

from dataclasses import dataclass
from typing import Final, TypeAlias

from ..core import ErrorMapper, RawError, decode_json
from ..models.error import Error

CapturePremiumErrorBody: TypeAlias = Error | RawError


@dataclass(frozen=True, slots=True)
class _CapturePremiumError:
    def map(self, status_code: int, content: bytes) -> CapturePremiumErrorBody:
        match status_code:
            case 400 | 409:
                return decode_json[Error](content)
            case _:
                return RawError(status_code, content)


capture_premium_error_mapper: Final[ErrorMapper[CapturePremiumErrorBody]] = _CapturePremiumError()
