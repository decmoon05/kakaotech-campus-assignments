import Link from "next/link";
import { Suspense } from "react";
import { getTodos } from "@/app/actions";
import TodoList from "@/components/TodoList";
import TodoForm from "@/components/TodoForm";
import FilterTabs from "@/components/FilterTabs";
import SearchInput from "@/components/SearchInput";

export default async function TodosPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string; search?: string }>;
}) {
  const { filter, search } = await searchParams;
  const todos = await getTodos({ filter, search });

  return (
    <main className="flex min-h-screen justify-center px-4 py-8">
      <div className="flex w-full max-w-xl flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm">
        <header className="flex items-baseline justify-between">
          <h1 className="text-xl font-bold text-[#672be0]">Todo</h1>
          <Link
            href="/todos/new"
            className="text-xs text-[#672be0] hover:underline"
          >
            + 새로 만들기
          </Link>
        </header>

        <TodoForm />

        <Suspense fallback={<div className="h-8" />}>
          <FilterTabs />
        </Suspense>

        <Suspense fallback={<div className="h-10" />}>
          <SearchInput />
        </Suspense>

        <TodoList todos={todos} />
      </div>
    </main>
  );
}
