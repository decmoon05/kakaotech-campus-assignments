"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createTodo } from "@/app/actions";

export default function TodoForm({ redirectTo }: { redirectTo?: string }) {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) {
      setError("내용을 입력해주세요");
      return;
    }
    setError("");
    startTransition(async () => {
      await createTodo({ content: trimmed });
      setInput("");
      if (redirectTo) router.push(redirectTo);
    });
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.nativeEvent.isComposing) return;
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="할 일을 입력하세요"
          disabled={isPending}
          className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#672be0] focus:ring-2 focus:ring-[#672be0]/20 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-[#672be0] px-4 py-2 text-sm font-medium text-white hover:bg-[#5921c5] disabled:opacity-50"
        >
          추가
        </button>
      </div>
      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-xs text-red-500">
          {error}
        </p>
      )}
    </form>
  );
}
