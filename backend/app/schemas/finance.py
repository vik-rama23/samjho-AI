from pydantic import BaseModel
from typing import Optional


class SalarySchema(BaseModel):
    gross_salary: int
    basic_salary: Optional[int] = None
    hra: Optional[int] = None
    deductions: Optional[int] = None


class TaxSchema(BaseModel):
    assessment_year: str
    tax_regime: str  # old / new
    section_80c: Optional[int] = None
    section_80d: Optional[int] = None


class EmiSchema(BaseModel):
    loan_amount: int
    interest_rate: float
    tenure_years: int
