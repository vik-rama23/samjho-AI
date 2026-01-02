from pydantic import BaseModel
from typing import Optional


class EligibilityInput(BaseModel):
    age: int
    annual_income: int
    category: Optional[str] = None  # SC/ST/OBC/GEN
    is_student: Optional[bool] = None
    state: Optional[str] = None
