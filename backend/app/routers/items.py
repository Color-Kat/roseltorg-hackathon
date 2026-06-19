"""Items CRUD routes — open demo, no auth required."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.item import Item
from app.schemas.item import ItemCreate, ItemRead, ItemUpdate

router = APIRouter(prefix="/items", tags=["items"])


async def _get_item_or_404(item_id: int, db: AsyncSession) -> Item:
    item = await db.scalar(select(Item).where(Item.id == item_id))
    if item is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Item not found"
        )
    return item


@router.get("", response_model=list[ItemRead])
async def list_items(db: AsyncSession = Depends(get_db)):
    items = await db.scalars(select(Item).order_by(Item.id))
    return list(items)


@router.post("", response_model=ItemRead, status_code=status.HTTP_201_CREATED)
async def create_item(body: ItemCreate, db: AsyncSession = Depends(get_db)):
    item = Item(title=body.title, description=body.description)
    db.add(item)
    await db.commit()
    await db.refresh(item)
    return item


@router.get("/{item_id}", response_model=ItemRead)
async def get_item(item_id: int, db: AsyncSession = Depends(get_db)):
    return await _get_item_or_404(item_id, db)


@router.put("/{item_id}", response_model=ItemRead)
async def update_item(
    item_id: int, body: ItemUpdate, db: AsyncSession = Depends(get_db)
):
    item = await _get_item_or_404(item_id, db)
    data = body.model_dump(exclude_unset=True)
    for key, value in data.items():
        setattr(item, key, value)
    await db.commit()
    await db.refresh(item)
    return item


@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_item(item_id: int, db: AsyncSession = Depends(get_db)):
    item = await _get_item_or_404(item_id, db)
    await db.delete(item)
    await db.commit()
