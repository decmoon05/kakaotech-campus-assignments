"use client";

import { useState, useTransition, memo } from "react";
import { updateTodo, deleteTodo } from "@/app/actions";
import type { Todo } from "@/lib/types";

function TodoItemImpl({ todo }: { todo: Todo }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(todo.content);
  const [isPending, startTransition] = useTransition();

  function startEdit() {
    setEditValue(todo.content);
    setIsEditing(true);
  }

  function finishEdit(commit: boolean) {
    if (commit) {
      const trimmed = editValue.trim();
      if (trimmed && trimmed !== todo.content) {
        startTransition(async () => {
          await updateTodo(todo.id, { content: trimmed });
        });
      }
    }
    setIsEditing(false);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.nativeEvent.isComposing) return;
    if (e.key === "Enter") finishEdit(true);
    if (e.key === "Escape") finishEdit(false);
  }

  function handleToggle() {
    startTransition(async () => {
      await updateTodo(todo.id, { done: !todo.done });
    });
  }

  function handleRemove() {
    startTransition(async () => {
      await deleteTodo(todo.id);
    });
  }

  return (
    <li
      className={
        "flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 " +
        (todo.done ? "opacity-60" : "")
      }
    >
      <input
        type="checkbox"
        checked={todo.done}
        onChange={handleToggle}
        disabled={isPending}
        className="h-4 w-4 accent-[#672be0]"
      />

      {isEditing ? (
        <input
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => finishEdit(true)}
          autoFocus
          className="flex-1 rounded border border-[#672be0] px-2 py-1 text-sm outline-none"
        />
      ) : (
        <span
          onDoubleClick={startEdit}
          className={
            "flex-1 text-sm " +
            (todo.done ? "text-slate-400 line-through" : "text-slate-700")
          }
        >
          {todo.content}
        </span>
      )}

      {!isEditing && (
        <button
          type="button"
          onClick={startEdit}
          disabled={isPending}
          className="text-xs text-slate-500 hover:text-[#672be0] disabled:opacity-50"
        >
          수정
        </button>
      )}
      <button
        type="button"
        onClick={handleRemove}
        disabled={isPending}
        className="text-xs text-slate-400 hover:text-red-500 disabled:opacity-50"
      >
        삭제
      </button>
    </li>
  );
}

export default memo(TodoItemImpl);
