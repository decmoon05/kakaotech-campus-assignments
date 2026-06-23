from sqlalchemy import select
from sqlalchemy.orm import Session

from models import Todo
from schemas import TodoCreate, TodoUpdate


def list_todos(
    db: Session,
    filter_: str | None = None,
    search: str | None = None,
) -> list[Todo]:
    stmt = select(Todo).order_by(Todo.created_at.desc())

    if filter_ == "active":
        stmt = stmt.where(Todo.done.is_(False))
    elif filter_ == "completed":
        stmt = stmt.where(Todo.done.is_(True))

    if search:
        stmt = stmt.where(Todo.content.contains(search))

    return list(db.scalars(stmt).all())


def get_todo(db: Session, todo_id: int) -> Todo | None:
    return db.scalar(select(Todo).where(Todo.id == todo_id))


def create_todo(db: Session, data: TodoCreate) -> Todo:
    todo = Todo(content=data.content)
    try:
        db.add(todo)
        db.commit()
        db.refresh(todo)
    except Exception:
        db.rollback()
        raise
    return todo


def update_todo(db: Session, todo: Todo, data: TodoUpdate) -> Todo:
    if data.content is not None:
        todo.content = data.content
    if data.done is not None:
        todo.done = data.done
    try:
        db.commit()
        db.refresh(todo)
    except Exception:
        db.rollback()
        raise
    return todo


def delete_todo(db: Session, todo: Todo) -> None:
    try:
        db.delete(todo)
        db.commit()
    except Exception:
        db.rollback()
        raise
