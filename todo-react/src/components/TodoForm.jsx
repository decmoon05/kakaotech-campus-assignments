import { useState } from "react";

export default function TodoForm({ onAdd }) {
  const [input, setInput] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!input.trim()) {
      onAdd("");
      return;
    }
    onAdd(input);
    setInput("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="할 일을 입력하세요"
        className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#672be0] focus:ring-2 focus:ring-[#672be0]/20"
      />
      <button
        type="submit"
        className="rounded-lg bg-[#672be0] px-4 py-2 text-sm font-medium text-white hover:bg-[#5921c5]"
      >
        추가
      </button>
    </form>
  );
}
