import Link from "next/link";
import TodoForm from "@/components/TodoForm";

export default function NewTodoPage() {
  return (
    <main className="flex min-h-screen justify-center px-4 py-8">
      <div className="flex w-full max-w-xl flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm">
        <header className="flex items-baseline justify-between">
          <h1 className="text-xl font-bold text-[#672be0]">새 Todo</h1>
          <Link
            href="/todos"
            className="text-xs text-slate-400 hover:text-slate-600"
          >
            ← 목록으로
          </Link>
        </header>
        <TodoForm redirectTo="/todos" />
      </div>
    </main>
  );
}
