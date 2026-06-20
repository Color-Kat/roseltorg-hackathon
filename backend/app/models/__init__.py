"""Import all models here so Alembic autogenerate and create_all see them."""

from app.models.assessment import AssessmentResult
from app.models.item import Item
from app.models.user import User

__all__ = ["User", "Item", "AssessmentResult"]
