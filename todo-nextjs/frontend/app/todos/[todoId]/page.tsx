import Link from "next/link";
import { notFound } from "next/navigation";
import { getTodo } from "@/app/actions";
import EditTodoForm from "@/components/EditTodoForm";

export default async function EditTodoPage({
  params,
}: {
  params: Promise<{ todoId: string }>;
}) {
  const { todoId } = await params;
  const id = Number(todoId);
  if (Number.isNaN(id)) notFound();

  const todo = await getTodo(id);
  if (!todo) notFound();

  return (
    <main className="flex min-h-screen justify-center px-4 py-8">
      <div className="flex w-full max-w-xl flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm">
        <header className="flex items-baseline justify-between">
          <h1 className="text-xl font-bold text-[#672be0]">수정</h1>
          <Link
            href="/todos"
            className="text-xs text-slate-400 hover:text-slate-600"
          >
            ← 목록으로
          </Link>
        </header>
        <EditTodoForm todo={todo} />
      </div>
    </main>
  );
}
