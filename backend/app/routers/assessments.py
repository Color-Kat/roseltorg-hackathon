"""Assessment results routes — open, no auth required."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.assessment import AssessmentResult
from app.schemas.assessment import AssessmentCreate, AssessmentRead

router = APIRouter(prefix="/assessments", tags=["assessments"])


async def _get_assessment_or_404(
    assessment_id: int, db: AsyncSession
) -> AssessmentResult:
    assessment = await db.scalar(
        select(AssessmentResult).where(AssessmentResult.id == assessment_id)
    )
    if assessment is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Assessment not found"
        )
    return assessment


@router.get("", response_model=list[AssessmentRead])
async def list_assessments(db: AsyncSession = Depends(get_db)):
    assessments = await db.scalars(
        select(AssessmentResult).order_by(AssessmentResult.id.desc())
    )
    return list(assessments)


@router.post(
    "", response_model=AssessmentRead, status_code=status.HTTP_201_CREATED
)
async def create_assessment(
    body: AssessmentCreate, db: AsyncSession = Depends(get_db)
):
    assessment = AssessmentResult(
        candidate_name=body.candidate_name,
        grade=body.grade,
        grade_label=body.grade_label,
        avg=body.avg,
        compliance=body.compliance,
        stats=body.stats,
        decisions=body.decisions,
        achievements=body.achievements,
        profile=body.profile,
    )
    db.add(assessment)
    await db.commit()
    await db.refresh(assessment)
    return assessment


@router.get("/{assessment_id}", response_model=AssessmentRead)
async def get_assessment(assessment_id: int, db: AsyncSession = Depends(get_db)):
    return await _get_assessment_or_404(assessment_id, db)


@router.delete("/{assessment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_assessment(
    assessment_id: int, db: AsyncSession = Depends(get_db)
):
    assessment = await _get_assessment_or_404(assessment_id, db)
    await db.delete(assessment)
    await db.commit()
