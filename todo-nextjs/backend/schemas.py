from datetime import datetime
from pydantic import BaseModel, Field


class TodoCreate(BaseModel):
    content: str = Field(min_length=1, max_length=1000)


class TodoUpdate(BaseModel):
    content: str | None = Field(default=None, min_length=1, max_length=1000)
    done: bool | None = None


class TodoResponse(BaseModel):
    id: int
    content: str
    done: bool
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
