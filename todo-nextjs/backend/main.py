import os
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from db import Base, engine, get_db
import crud
from schemas import TodoCreate, TodoUpdate, TodoResponse

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Todo API")

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "Todo API"}


@app.get("/todos", response_model=list[TodoResponse])
def list_todos(
    filter: str | None = None,
    search: str | None = None,
    db: Session = Depends(get_db),
):
    return crud.list_todos(db, filter_=filter, search=search)


@app.post("/todos", response_model=TodoResponse, status_code=status.HTTP_201_CREATED)
def create_todo(data: TodoCreate, db: Session = Depends(get_db)):
    return crud.create_todo(db, data)


@app.get("/todos/{todo_id}", response_model=TodoResponse)
def get_todo(todo_id: int, db: Session = Depends(get_db)):
    todo = crud.get_todo(db, todo_id)
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    return todo


@app.put("/todos/{todo_id}", response_model=TodoResponse)
def update_todo(todo_id: int, data: TodoUpdate, db: Session = Depends(get_db)):
    todo = crud.get_todo(db, todo_id)
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    return crud.update_todo(db, todo, data)


@app.delete("/todos/{todo_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_todo(todo_id: int, db: Session = Depends(get_db)):
    todo = crud.get_todo(db, todo_id)
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    crud.delete_todo(db, todo)
