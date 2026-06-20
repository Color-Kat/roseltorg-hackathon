"""AssessmentResult-related Pydantic schemas."""

from datetime import datetime

from pydantic import BaseModel, ConfigDict


class AssessmentCreate(BaseModel):
    candidate_name: str
    grade: str
    grade_label: str
    avg: int
    compliance: int = 0
    stats: dict = {}
    decisions: list = []
    achievements: list = []
    profile: dict = {}


class AssessmentRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    candidate_name: str
    grade: str
    grade_label: str
    avg: int
    compliance: int
    stats: dict
    decisions: list
    achievements: list
    profile: dict
    created_at: datetime
