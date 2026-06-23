"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateTodo, deleteTodo } from "@/app/actions";
import type { Todo } from "@/lib/types";

export default function EditTodoForm({ todo }: { todo: Todo }) {
  const [content, setContent] = useState(todo.content);
  const [done, setDone] = useState(todo.done);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = content.trim();
    if (!trimmed) {
      setError("내용을 입력해주세요");
      return;
    }
    setError("");
    startTransition(async () => {
      await updateTodo(todo.id, { content: trimmed, done });
      router.push("/todos");
    });
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.nativeEvent.isComposing) return;
  }

  function handleDelete() {
    startTransition(async () => {
      await deleteTodo(todo.id);
      router.push("/todos");
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isPending}
        className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#672be0] focus:ring-2 focus:ring-[#672be0]/20 disabled:opacity-50"
      />

      <label className="flex items-center gap-2 text-sm text-slate-600">
        <input
          type="checkbox"
          checked={done}
          onChange={(e) => setDone(e.target.checked)}
          disabled={isPending}
          className="h-4 w-4 accent-[#672be0]"
        />
        완료 표시
      </label>

      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-xs text-red-500">
          {error}
        </p>
      )}

      <div className="flex justify-between">
        <button
          type="button"
          onClick={handleDelete}
          disabled={isPending}
          className="rounded-lg border border-red-300 px-4 py-2 text-sm text-red-500 hover:bg-red-50 disabled:opacity-50"
        >
          삭제
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-[#672be0] px-4 py-2 text-sm font-medium text-white hover:bg-[#5921c5] disabled:opacity-50"
        >
          저장
        </button>
      </div>
    </form>
  );
}
