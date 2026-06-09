import { useState } from "react";

export default function TodoItem({ todo, onToggle, onRemove, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(todo.content);

  function startEdit() {
    setEditValue(todo.content);
    setIsEditing(true);
  }

  function finishEdit(commit) {
    if (commit) {
      const trimmed = editValue.trim();
      if (trimmed && trimmed !== todo.content) {
        onEdit(todo.id, trimmed);
      }
    }
    setIsEditing(false);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") finishEdit(true);
    if (e.key === "Escape") finishEdit(false);
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
        onChange={() => onToggle(todo.id)}
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
            "flex-1 text-sm " + (todo.done ? "text-slate-400 line-through" : "text-slate-700")
          }
        >
          {todo.content}
        </span>
      )}

      {!isEditing && (
        <button
          type="button"
          onClick={startEdit}
          className="text-xs text-slate-500 hover:text-[#672be0]"
        >
          수정
        </button>
      )}
      <button
        type="button"
        onClick={() => onRemove(todo.id)}
        className="text-xs text-slate-400 hover:text-red-500"
      >
        삭제
      </button>
    </li>
  );
}
